import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      projects: 'Projects',
      tasks: 'Tasks',
      pricing: 'Pricing',
      
      // Auth
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      
      // Dashboard
      welcomeBack: 'Welcome back',
      createProject: 'Create Project',
      noProjects: 'No projects yet',
      getStarted: 'Get started by creating your first project',
      
      // Tasks
      todo: 'To Do',
      inProgress: 'In Progress',
      done: 'Done',
      addTask: 'Add Task',
      
      // AI
      aiHelper: 'AI Helper',
      askAI: 'Ask AI for help',
      getTaskSuggestions: 'Get Task Suggestions',
      
      // Account
      account: {
        title: 'My Account',
        subtitle: 'Manage your profile, subscription plan, and preferences.',
        profile: 'Profile Information',
        profileDesc: 'Update your personal information and email preferences.',
        name: 'Full Name',
        email: 'Email Address',
        saveProfile: 'Save Changes',
        subscription: 'Subscription Plan',
        subscriptionDesc: 'Manage your current plan and billing information.',
        currentPlan: 'Current Plan',
        upgradeMessage: 'Upgrade to unlock premium features like unlimited projects, AI assistance, and advanced analytics.',
        upgradePlan: 'Upgrade Plan',
        memberSince: 'Member since',
        settings: 'Account Settings',
        settingsDesc: 'Configure your account preferences and security settings.',
        notifications: 'Email Notifications',
        configure: 'Configure',
        privacy: 'Privacy Settings',
        manage: 'Manage',
        security: 'Security',
        changePassword: 'Change Password',
        language: 'Language & Region',
        languageDesc: 'Set your preferred language and regional settings.',
        preferredLanguage: 'Preferred Language',
        languageNote: 'Use the language switcher in the header to change your language preference.',
        timezone: 'Timezone',
        dangerZone: 'Danger Zone',
        dangerDesc: 'Irreversible and destructive actions.',
        deleteAccount: 'Delete Account',
        deleteWarning: 'Permanently delete your account and all associated data.',
        delete: 'Delete'
      },
      
      // Common
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      update: 'Update',
    }
  },
  fr: {
    translation: {
      dashboard: 'Tableau de bord',
      projects: 'Projets',
      tasks: 'Tâches',
      pricing: 'Tarification',
      
      signIn: 'Se connecter',
      signUp: 'S\'inscrire',
      signOut: 'Se déconnecter',
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      
      welcomeBack: 'Bon retour',
      createProject: 'Créer un projet',
      noProjects: 'Aucun projet encore',
      getStarted: 'Commencez par créer votre premier projet',
      
      todo: 'À faire',
      inProgress: 'En cours',
      done: 'Terminé',
      addTask: 'Ajouter une tâche',
      
      aiHelper: 'Assistant IA',
      askAI: 'Demander de l\'aide à l\'IA',
      getTaskSuggestions: 'Obtenir des suggestions de tâches',
      
      account: {
        title: 'Mon Compte',
        subtitle: 'Gérez votre profil, plan d\'abonnement et préférences.',
        profile: 'Informations du Profil',
        profileDesc: 'Mettez à jour vos informations personnelles et préférences email.',
        name: 'Nom Complet',
        email: 'Adresse Email',
        saveProfile: 'Sauvegarder les Changements',
        subscription: 'Plan d\'Abonnement',
        subscriptionDesc: 'Gérez votre plan actuel et informations de facturation.',
        currentPlan: 'Plan Actuel',
        upgradeMessage: 'Passez au niveau supérieur pour débloquer les fonctionnalités premium comme les projets illimités, l\'assistance IA et les analyses avancées.',
        upgradePlan: 'Améliorer le Plan',
        memberSince: 'Membre depuis',
        settings: 'Paramètres du Compte',
        settingsDesc: 'Configurez vos préférences de compte et paramètres de sécurité.',
        notifications: 'Notifications Email',
        configure: 'Configurer',
        privacy: 'Paramètres de Confidentialité',
        manage: 'Gérer',
        security: 'Sécurité',
        changePassword: 'Changer le Mot de Passe',
        language: 'Langue et Région',
        languageDesc: 'Définissez votre langue préférée et paramètres régionaux.',
        preferredLanguage: 'Langue Préférée',
        languageNote: 'Utilisez le sélecteur de langue dans l\'en-tête pour changer votre préférence de langue.',
        timezone: 'Fuseau Horaire',
        dangerZone: 'Zone de Danger',
        dangerDesc: 'Actions irréversibles et destructrices.',
        deleteAccount: 'Supprimer le Compte',
        deleteWarning: 'Supprimer définitivement votre compte et toutes les données associées.',
        delete: 'Supprimer'
      },
      
      loading: 'Chargement...',
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      create: 'Créer',
      update: 'Mettre à jour',
    }
  },
  es: {
    translation: {
      dashboard: 'Panel',
      projects: 'Proyectos',
      tasks: 'Tareas',
      pricing: 'Precios',
      
      signIn: 'Iniciar sesión',
      signUp: 'Registrarse',
      signOut: 'Cerrar sesión',
      email: 'Email',
      password: 'Contraseña',
      confirmPassword: 'Confirmar contraseña',
      
      welcomeBack: 'Bienvenido de vuelta',
      createProject: 'Crear proyecto',
      noProjects: 'No hay proyectos aún',
      getStarted: 'Comienza creando tu primer proyecto',
      
      todo: 'Por hacer',
      inProgress: 'En progreso',
      done: 'Hecho',
      addTask: 'Agregar tarea',
      
      aiHelper: 'Asistente IA',
      askAI: 'Pedir ayuda a la IA',
      getTaskSuggestions: 'Obtener sugerencias de tareas',
      
      account: {
        title: 'Mi Cuenta',
        subtitle: 'Gestiona tu perfil, plan de suscripción y preferencias.',
        profile: 'Información del Perfil',
        profileDesc: 'Actualiza tu información personal y preferencias de email.',
        name: 'Nombre Completo',
        email: 'Dirección de Email',
        saveProfile: 'Guardar Cambios',
        subscription: 'Plan de Suscripción',
        subscriptionDesc: 'Gestiona tu plan actual e información de facturación.',
        currentPlan: 'Plan Actual',
        upgradeMessage: 'Actualiza para desbloquear funciones premium como proyectos ilimitados, asistencia IA y análisis avanzados.',
        upgradePlan: 'Actualizar Plan',
        memberSince: 'Miembro desde',
        settings: 'Configuración de Cuenta',
        settingsDesc: 'Configura las preferencias de tu cuenta y ajustes de seguridad.',
        notifications: 'Notificaciones por Email',
        configure: 'Configurar',
        privacy: 'Configuración de Privacidad',
        manage: 'Gestionar',
        security: 'Seguridad',
        changePassword: 'Cambiar Contraseña',
        language: 'Idioma y Región',
        languageDesc: 'Establece tu idioma preferido y configuración regional.',
        preferredLanguage: 'Idioma Preferido',
        languageNote: 'Usa el selector de idioma en el encabezado para cambiar tu preferencia de idioma.',
        timezone: 'Zona Horaria',
        dangerZone: 'Zona de Peligro',
        dangerDesc: 'Acciones irreversibles y destructivas.',
        deleteAccount: 'Eliminar Cuenta',
        deleteWarning: 'Eliminar permanentemente tu cuenta y todos los datos asociados.',
        delete: 'Eliminar'
      },
      
      loading: 'Cargando...',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      create: 'Crear',
      update: 'Actualizar',
    }
  },
  de: {
    translation: {
      dashboard: 'Dashboard',
      projects: 'Projekte',
      tasks: 'Aufgaben',
      pricing: 'Preise',
      
      signIn: 'Anmelden',
      signUp: 'Registrieren',
      signOut: 'Abmelden',
      email: 'E-Mail',
      password: 'Passwort',
      confirmPassword: 'Passwort bestätigen',
      
      welcomeBack: 'Willkommen zurück',
      createProject: 'Projekt erstellen',
      noProjects: 'Noch keine Projekte',
      getStarted: 'Beginnen Sie mit der Erstellung Ihres ersten Projekts',
      
      todo: 'Zu erledigen',
      inProgress: 'In Bearbeitung',
      done: 'Erledigt',
      addTask: 'Aufgabe hinzufügen',
      
      aiHelper: 'KI-Assistent',
      askAI: 'KI um Hilfe bitten',
      getTaskSuggestions: 'Aufgabenvorschläge erhalten',
      
      account: {
        title: 'Mein Konto',
        subtitle: 'Verwalten Sie Ihr Profil, Abonnement und Einstellungen.',
        profile: 'Profilinformationen',
        profileDesc: 'Aktualisieren Sie Ihre persönlichen Informationen und E-Mail-Einstellungen.',
        name: 'Vollständiger Name',
        email: 'E-Mail-Adresse',
        saveProfile: 'Änderungen Speichern',
        subscription: 'Abonnement-Plan',
        subscriptionDesc: 'Verwalten Sie Ihren aktuellen Plan und Rechnungsinformationen.',
        currentPlan: 'Aktueller Plan',
        upgradeMessage: 'Upgraden Sie, um Premium-Funktionen wie unbegrenzte Projekte, KI-Unterstützung und erweiterte Analysen freizuschalten.',
        upgradePlan: 'Plan Upgraden',
        memberSince: 'Mitglied seit',
        settings: 'Kontoeinstellungen',
        settingsDesc: 'Konfigurieren Sie Ihre Konto-Einstellungen und Sicherheitsoptionen.',
        notifications: 'E-Mail-Benachrichtigungen',
        configure: 'Konfigurieren',
        privacy: 'Datenschutz-Einstellungen',
        manage: 'Verwalten',
        security: 'Sicherheit',
        changePassword: 'Passwort Ändern',
        language: 'Sprache & Region',
        languageDesc: 'Legen Sie Ihre bevorzugte Sprache und regionale Einstellungen fest.',
        preferredLanguage: 'Bevorzugte Sprache',
        languageNote: 'Verwenden Sie den Sprachumschalter im Header, um Ihre Spracheinstellung zu ändern.',
        timezone: 'Zeitzone',
        dangerZone: 'Gefahrenbereich',
        dangerDesc: 'Irreversible und destruktive Aktionen.',
        deleteAccount: 'Konto Löschen',
        deleteWarning: 'Ihr Konto und alle zugehörigen Daten dauerhaft löschen.',
        delete: 'Löschen'
      },
      
      loading: 'Laden...',
      save: 'Speichern',
      cancel: 'Abbrechen',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      create: 'Erstellen',
      update: 'Aktualisieren',
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  })

export default i18n