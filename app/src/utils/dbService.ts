import { supabase, isSupabaseConfigured } from './supabaseClient';

// Ensure mock users are seeded in localStorage if using fallback
const getLocalUsers = () => {
  const stored = localStorage.getItem('mock_users');
  if (!stored) {
    localStorage.setItem('mock_users', JSON.stringify([]));
    return [];
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
};

const saveLocalUsers = (users: any[]) => {
  localStorage.setItem('mock_users', JSON.stringify(users));
};

export const seedMockUsers = () => {
  const isReset = localStorage.getItem('mock_users_reset_v2');
  if (!isReset) {
    localStorage.setItem('mock_users', JSON.stringify([]));
    localStorage.setItem('mock_users_reset_v2', 'true');
  } else {
    const stored = localStorage.getItem('mock_users');
    if (!stored) {
      localStorage.setItem('mock_users', JSON.stringify([]));
    }
  }
};

export const dbService = {
  // --- AUTH SERVICES ---
  
  async signUp(email: string, password: string, name: string) {
    if (isSupabaseConfigured && supabase) {
      // 1. Supabase Auth Sign Up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      if (error) throw error;
      
      const session = data.session;
      const user = data.user;
      const emailConfirmationRequired = user && !session;
      
      let profile = null;
      if (user) {
        // Try to fetch profile (it might be created by trigger)
        let { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        profile = prof;
        
        if (!profile && !emailConfirmationRequired) {
          // If trigger didn't run and confirmation not required, create profile on-the-fly
          const newProfile = {
            id: user.id,
            name: name,
            email: email,
            has_paid: false,
            is_active: true,
            role: 'user'
          };
          const { error: insErr } = await supabase
            .from('profiles')
            .insert(newProfile);
          if (!insErr) {
            profile = newProfile;
            await supabase.from('tax_calculations').upsert({ id: user.id });
          }
        }
      }

      return {
        user: user ? {
          id: user.id,
          name: profile?.name || name,
          email: user.email || email,
          hasPaid: profile?.has_paid || false,
          isActive: profile?.is_active || true,
          isAdmin: profile?.role === 'admin'
        } : null,
        session,
        emailConfirmationRequired
      };
    } else {
      // 2. LocalStorage Fallback
      const users = getLocalUsers();
      if (users.find((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Account with this email already exists!');
      }
      const newUser = {
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
        hasPaid: false,
        isActive: true,
        role: 'user'
      };
      users.push(newUser);
      saveLocalUsers(users);
      return {
        user: {
          name,
          email,
          hasPaid: false,
          isActive: true,
          isAdmin: false
        },
        session: null,
        emailConfirmationRequired: false
      };
    }
  },

  async signIn(email: string, password: string) {
    if (isSupabaseConfigured && supabase) {
      // 1. Supabase Auth Sign In
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        if (error.message && error.message.toLowerCase().includes('confirm')) {
          throw new Error('Please confirm your email address before logging in. Check your inbox for the verification link.');
        }
        throw error;
      }
      
      // Fetch details from profiles table with fallback
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();
        
      if (profileError) {
        console.warn('Profile fetch error during login:', profileError);
      }
      
      if (!profile) {
        // If the account was created more than 5 minutes ago but has no profile, it was deleted
        const accountAgeMs = new Date().getTime() - new Date(data.user.created_at).getTime();
        if (accountAgeMs > 5 * 60 * 1000) {
          throw new Error('This account has been deleted by an administrator. Please contact support.');
        }

        // Create profile on-the-fly if missing (trigger failsafe for brand new users)
        const newProfile = {
          id: data.user.id,
          name: data.user.user_metadata?.name || 'Valued User',
          email: data.user.email || '',
          has_paid: false,
          is_active: true,
          role: 'user'
        };
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile);
          
        if (insertError) {
          console.error('Failed to create missing profile on-the-fly:', insertError);
        } else {
          profile = newProfile;
          // Pre-populate empty tax calculation row
          await supabase
            .from('tax_calculations')
            .upsert({ id: data.user.id });
        }
      }
      
      const resolvedProfile = profile || {
        name: data.user.user_metadata?.name || 'Valued User',
        email: data.user.email || '',
        has_paid: false,
        is_active: true,
        role: 'user'
      };
      
      if (!resolvedProfile.is_active) {
        throw new Error('Your account has been deactivated. Please contact support.');
      }
      
      return {
        id: data.user.id,
        name: resolvedProfile.name,
        email: resolvedProfile.email,
        hasPaid: resolvedProfile.has_paid,
        isActive: resolvedProfile.is_active,
        isAdmin: resolvedProfile.role === 'admin'
      };
    } else {
      // Admin override for local fallback (kept for failsafe development usage)
      if (email === 'admin@taxcalc.com' && password === 'admin123') {
        return { name: 'System Admin', email: 'admin@taxcalc.com', isAdmin: true };
      }
      // 2. LocalStorage Fallback
      const users = getLocalUsers();
      const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password. Please try again.');
      }
      if (!user.isActive) {
        throw new Error('Your account has been deactivated. Please contact support.');
      }
      
      return {
        name: user.name,
        email: user.email,
        hasPaid: user.hasPaid,
        isActive: user.isActive,
        isAdmin: user.role === 'admin' || email === 'admin@taxcalc.com'
      };
    }
  },

  async signOut() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
  },

  async updatePassword(password: string) {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.updateUser({
        password
      });
      if (error) throw error;
    } else {
      // Handled in ProfilePage directly via LocalStorage since we need current password verification
    }
  },

  async fetchUserProfile(userId: string) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          hasPaid: data.has_paid,
          isActive: data.is_active,
          isAdmin: data.role === 'admin'
        };
      }
    }
    return null;
  },

  async getCurrentUserProfile() {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        return this.fetchUserProfile(user.id);
      }
    }
    return null;
  },

  // --- PROFILE SERVICES ---

  async updateProfileName(email: string, name: string) {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ name })
          .eq('id', user.id);
        if (error) throw error;
      }
    } else {
      const users = getLocalUsers();
      const updated = users.map((u: any) => 
        u.email.toLowerCase() === email.toLowerCase() ? { ...u, name } : u
      );
      saveLocalUsers(updated);
    }
  },

  async updateProfilePayment(email: string, hasPaid: boolean) {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('profiles')
        .update({ has_paid: hasPaid })
        .eq('email', email);
      if (error) throw error;
    } else {
      const users = getLocalUsers();
      const updated = users.map((u: any) => 
        u.email.toLowerCase() === email.toLowerCase() ? { ...u, hasPaid } : u
      );
      saveLocalUsers(updated);
    }
  },

  async updateProfileActive(email: string, isActive: boolean) {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: isActive })
        .eq('email', email);
      if (error) throw error;
    } else {
      const users = getLocalUsers();
      const updated = users.map((u: any) => 
        u.email.toLowerCase() === email.toLowerCase() ? { ...u, isActive } : u
      );
      saveLocalUsers(updated);
    }
  },

  async fetchAllProfiles() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      
      return data.map((p: any) => ({
        name: p.name,
        email: p.email,
        createdAt: p.created_at,
        hasPaid: p.has_paid,
        isActive: p.is_active,
        isAdmin: p.role === 'admin'
      }));
    } else {
      return getLocalUsers().map((u: any) => ({
        name: u.name,
        email: u.email,
        createdAt: u.createdAt,
        hasPaid: u.hasPaid,
        isActive: u.isActive,
        isAdmin: u.role === 'admin' || u.email === 'admin@taxcalc.com'
      }));
    }
  },

  async deleteProfile(email: string) {
    if (isSupabaseConfigured && supabase) {
      // Delete user profile (in a real production app, deleting from auth.users requires admin API.
      // However, if delete cascade is set on the foreign key, deleting from public.profiles or deleting user is handled.)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('email', email);
      if (error) throw error;
    } else {
      const users = getLocalUsers();
      const updated = users.filter((u: any) => u.email.toLowerCase() !== email.toLowerCase());
      saveLocalUsers(updated);
    }
  },

  // --- TAX CALCULATION SERVICES ---

  async saveTaxData(email: string, taxData: any) {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Map camelCase fields to snake_case table columns
        const mappedData = {
          age_category: taxData.ageCategory,
          monthly_take_home: taxData.monthlyTakeHome,
          other_income: taxData.otherIncome,
          basic_salary: taxData.basicSalary,
          hra_received: taxData.hraReceived,
          pf_deduction: taxData.pfDeduction,
          pays_rent: taxData.paysRent,
          monthly_rent: taxData.monthlyRent,
          city: taxData.city,
          is_metro: taxData.isMetro,
          has_80c: taxData.has80C,
          total_80c: taxData.total80C,
          has_health_insurance: taxData.hasHealthInsurance,
          health_self: taxData.healthSelf,
          health_parents: taxData.healthParents,
          parents_senior: taxData.parentsSenior,
          has_home_loan: taxData.hasHomeLoan,
          home_loan_interest: taxData.homeLoanInterest,
          has_nps: taxData.hasNPS,
          nps_amount: taxData.npsAmount,
          has_education_loan: taxData.hasEducationLoan,
          education_loan_interest: taxData.educationLoanInterest,
          has_professional_tax: taxData.hasProfessionalTax,
          professional_tax_amount: taxData.professionalTaxAmount,
          updated_at: new Date().toISOString()
        };
        
        // Upsert calculations
        const { error } = await supabase
          .from('tax_calculations')
          .upsert({ id: user.id, ...mappedData });
          
        if (error) throw error;
      }
    } else {
      // LocalStorage Fallback - save tax calculations to a separate key keyed by user email
      localStorage.setItem(`tax_calc_${email.toLowerCase()}`, JSON.stringify(taxData));
    }
  },

  async loadTaxData(email: string) {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('tax_calculations')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') throw error; // Ignore not found error
        
        if (data) {
          // Map snake_case columns back to camelCase state properties
          return {
            ageCategory: data.age_category,
            monthlyTakeHome: Number(data.monthly_take_home),
            otherIncome: Number(data.other_income),
            basicSalary: Number(data.basic_salary),
            hraReceived: Number(data.hra_received),
            pfDeduction: Number(data.pf_deduction),
            paysRent: data.pays_rent,
            monthlyRent: Number(data.monthly_rent),
            city: data.city,
            isMetro: data.is_metro,
            has80C: data.has_80c,
            total80C: Number(data.total_80c),
            hasHealthInsurance: data.has_health_insurance,
            healthSelf: Number(data.health_self),
            healthParents: Number(data.health_parents),
            parentsSenior: data.parents_senior,
            hasHomeLoan: data.has_home_loan,
            homeLoanInterest: Number(data.home_loan_interest),
            hasNPS: data.has_nps,
            npsAmount: Number(data.nps_amount),
            hasEducationLoan: data.has_education_loan,
            educationLoanInterest: Number(data.education_loan_interest),
            hasProfessionalTax: data.has_professional_tax,
            professionalTaxAmount: Number(data.professional_tax_amount)
          };
        }
      }
      return null;
    } else {
      // LocalStorage Fallback
      const stored = localStorage.getItem(`tax_calc_${email.toLowerCase()}`);
      return stored ? JSON.parse(stored) : null;
    }
  }
};
