import * as bcrypt from 'bcryptjs';

class MockBackendService {
  constructor() {
    this.users = new Map();
    this.profiles = new Map();
    this.init();
  }

  init() {
    if (typeof window !== 'undefined') {
      console.log('MockBackend: Initializing from localStorage...');
      
      // Load users
      const savedUsers = localStorage.getItem('nutricombat_mock_users');
      console.log('MockBackend: Raw saved users from localStorage:', savedUsers);
      
      if (savedUsers) {
        try {
          const parsedUsers = JSON.parse(savedUsers);
          console.log('MockBackend: Parsed users:', parsedUsers);
          this.users = new Map(parsedUsers);
          console.log('MockBackend: Loaded users map:', [...this.users.entries()]);
        } catch (error) {
          console.error('MockBackend: Error parsing users from localStorage:', error);
          this.users = new Map();
        }
      } else {
        console.log('MockBackend: No saved users found in localStorage');
        this.users = new Map();
      }
      
      // Load profiles
      const savedProfiles = localStorage.getItem('nutricombat_mock_profiles');
      console.log('MockBackend: Raw saved profiles from localStorage:', savedProfiles);
      
      if (savedProfiles) {
        try {
          const parsedProfiles = JSON.parse(savedProfiles);
          console.log('MockBackend: Parsed profiles:', parsedProfiles);
          this.profiles = new Map(parsedProfiles);
          console.log('MockBackend: Loaded profiles map:', [...this.profiles.entries()]);
        } catch (error) {
          console.error('MockBackend: Error parsing profiles from localStorage:', error);
          this.profiles = new Map();
        }
      } else {
        console.log('MockBackend: No saved profiles found in localStorage');
        this.profiles = new Map();
      }
      
      console.log('MockBackend: Initialization complete. Total users:', this.users.size, 'Total profiles:', this.profiles.size);
    } else {
      console.log('MockBackend: Window not available, running in server mode');
      this.users = new Map();
      this.profiles = new Map();
    }
  }

  saveUsers() {
    if (typeof window !== 'undefined') {
      const usersArray = [...this.users];
      const usersJson = JSON.stringify(usersArray);
      console.log('MockBackend: Saving users to localStorage:', usersArray);
      localStorage.setItem('nutricombat_mock_users', usersJson);
      console.log('MockBackend: Users saved. Verification read:', localStorage.getItem('nutricombat_mock_users'));
    }
  }

  saveProfiles() {
    if (typeof window !== 'undefined') {
      const profilesArray = [...this.profiles];
      const profilesJson = JSON.stringify(profilesArray);
      console.log('MockBackend: Saving profiles to localStorage:', profilesArray);
      localStorage.setItem('nutricombat_mock_profiles', profilesJson);
      console.log('MockBackend: Profiles saved. Verification read:', localStorage.getItem('nutricombat_mock_profiles'));
    }
  }

  async register(email, password) {
    console.log('Mock backend register called with:', { email, password: '***' });
    if (this.users.has(email)) {
      throw new Error('El usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.users.set(email, user);
    this.saveUsers();
    console.log('User registered and saved. Total users:', this.users.size);

    const token = btoa(email); // Use browser's btoa instead of Buffer
    const { password: _, ...userResponse } = user;
    return {
      message: 'Usuario registrado exitosamente',
      user: { ...userResponse, token }
    };
  }

  async login(email, password) {
    console.log('Mock backend login called with:', { email, password: '***' });
    console.log('Available users:', [...this.users.keys()]);
    
    const user = this.users.get(email);
    if (!user) {
      console.log('User not found for email:', email);
      throw new Error('Credenciales inválidas');
    }

    console.log('User found, checking password...');
    const isValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValid);
    
    if (!isValid) {
      throw new Error('Credenciales inválidas');
    }

    const token = btoa(email); // Use browser's btoa instead of Buffer
    const { password: _, ...userResponse } = user;
    return {
      message: 'Inicio de sesión exitoso',
      user: { ...userResponse, token }
    };
  }

  async getProfile(token) {
    const email = atob(token); // Use browser's atob instead of Buffer
    const user = this.users.get(email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    const profile = this.profiles.get(user.id);
    return {
      profile: profile || null
    };
  }

  async createProfile(token, profileData) {
    const email = atob(token); // Use browser's atob instead of Buffer
    const user = this.users.get(email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const profile = {
      id: Date.now().toString(),
      user_id: user.id,
      ...profileData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.profiles.set(user.id, profile);
    this.saveProfiles();

    return {
      profile,
      message: 'Perfil creado exitosamente'
    };
  }

  async updateProfile(token, profileData) {
    const email = atob(token); // Use browser's atob instead of Buffer
    const user = this.users.get(email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const existingProfile = this.profiles.get(user.id);
    if (!existingProfile) {
      return this.createProfile(token, profileData);
    }

    const updatedProfile = {
      ...existingProfile,
      ...profileData,
      updated_at: new Date().toISOString(),
    };

    this.profiles.set(user.id, updatedProfile);
    this.saveProfiles();

    return {
      profile: updatedProfile,
      message: 'Perfil actualizado exitosamente'
    };
  }

  health() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'nutricombat-backend-mock'
    };
  }
}

export default new MockBackendService();