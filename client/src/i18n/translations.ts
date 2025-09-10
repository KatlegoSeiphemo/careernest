// Translation system for West African languages

export interface TranslationKeys {
  // Common UI
  welcome: string;
  login: string;
  register: string;
  logout: string;
  dashboard: string;
  profile: string;
  settings: string;
  help: string;
  loading: string;
  error: string;
  success: string;
  cancel: string;
  save: string;
  continue: string;
  back: string;
  next: string;
  finish: string;
  
  // Navigation
  careerAssessment: string;
  cvGenerator: string;
  coverLetter: string;
  aiServices: string;
  jobSearch: string;
  mentorship: string;
  communities: string;
  
  // AI Services
  aiServicesTitle: string;
  aiServicesDescription: string;
  cvGeneratorService: string;
  coverLetterService: string;
  jobAlertsService: string;
  payWithMomo: string;
  serviceActive: string;
  servicePending: string;
  serviceExpired: string;
  
  // Payment
  paymentTitle: string;
  paymentDescription: string;
  phoneNumber: string;
  paymentAmount: string;
  paymentSuccess: string;
  paymentFailed: string;
  paymentPending: string;
  
  // Job Search
  jobSearchTitle: string;
  searchJobs: string;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  applyNow: string;
  
  // Forms
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumberLabel: string;
  
  // Messages
  welcomeMessage: string;
  loginSuccess: string;
  registrationSuccess: string;
  paymentProcessing: string;
  serviceActivated: string;

  // MoMo Services
  momoServices: string;
  securePayments: string;
  secureEncrypted: string;
  instantActivation: string;
  availableServices: string;
  selectServiceToPay: string;
  momoRegisteredNumber: string;
  payNow: string;
  processing: string;
  paymentInitiated: string;
  checkPhoneForPrompt: string;
  paymentSuccessful: string;
  paymentFailedMessage: string;
  paymentError: string;
  transactionId: string;
  pending: string;
  completed: string;
  failed: string;
  active: string;
  available: string;
  selected: string;
  select: string;
  oneTime: string;
  expires: string;
  myServices: string;
  fillAllFields: string;

  // Mentor Payments
  mentorPayments: string;
  managePaymentsAndEarnings: string;
  totalEarnings: string;
  pendingPayments: string;
  completedSessions: string;
  fromLastMonth: string;
  awaitingCollection: string;
  thisMonth: string;
  growth: string;
  monthOverMonth: string;
  mentorshipSessions: string;
  manageSessionPayments: string;
  paymentRequests: string;
  trackPaymentRequests: string;
  createRequest: string;
  createPaymentRequest: string;
  sendPaymentRequestToClient: string;
  clientPhoneNumber: string;
  clientMomoNumber: string;
  amount: string;
  description: string;
  mentorshipSessionPayment: string;
  creating: string;
  requestPayment: string;
  noSessionsYet: string;
  noPaymentRequestsYet: string;
  minutes: string;
  scheduled: string;
  created: string;
  howItWorks: string;
  enterClientDetails: string;
  clientReceivesPaymentPrompt: string;
  paymentProcessedAutomatically: string;
  fundsTransferredToAccount: string;
  paymentRequestSent: string;
  clientWillReceivePrompt: string;
  failedToCreateRequest: string;
  failedToRequestPayment: string;
}

export const translations: Record<string, TranslationKeys> = {
  // English (Ghana) - Base language
  'en-GH': {
    welcome: 'Welcome',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    dashboard: 'Dashboard',
    profile: 'Profile',
    settings: 'Settings',
    help: 'Help',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    continue: 'Continue',
    back: 'Back',
    next: 'Next',
    finish: 'Finish',
    
    careerAssessment: 'Career Assessment',
    cvGenerator: 'CV Generator',
    coverLetter: 'Cover Letter',
    aiServices: 'AI Services',
    jobSearch: 'Job Search',
    mentorship: 'Mentorship',
    communities: 'Communities',
    
    aiServicesTitle: 'AI-Powered Career Services',
    aiServicesDescription: 'Boost your career with our AI-powered tools',
    cvGeneratorService: 'Professional CV Generator',
    coverLetterService: 'Cover Letter Generator',
    jobAlertsService: 'Personalized Job Alerts',
    payWithMomo: 'Pay with MTN MoMo',
    serviceActive: 'Active',
    servicePending: 'Pending',
    serviceExpired: 'Expired',
    
    paymentTitle: 'Complete Payment',
    paymentDescription: 'Pay securely with MTN Mobile Money',
    phoneNumber: 'Phone Number',
    paymentAmount: 'Amount',
    paymentSuccess: 'Payment successful!',
    paymentFailed: 'Payment failed. Please try again.',
    paymentPending: 'Processing payment...',
    
    jobSearchTitle: 'Find Your Dream Job',
    searchJobs: 'Search Jobs',
    jobTitle: 'Job Title',
    company: 'Company',
    location: 'Location',
    salary: 'Salary',
    applyNow: 'Apply Now',
    
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    phoneNumberLabel: 'Phone Number',
    
    welcomeMessage: 'Welcome to CareerNest',
    loginSuccess: 'Login successful!',
    registrationSuccess: 'Registration successful!',
    paymentProcessing: 'Processing your payment...',
    serviceActivated: 'Service activated successfully!',

    // MoMo Services
    momoServices: 'MoMo Services',
    securePayments: 'Secure Payments',
    secureEncrypted: 'Secure & Encrypted',
    instantActivation: 'Instant Activation',
    availableServices: 'Available Services',
    selectServiceToPay: 'Select a service to pay',
    momoRegisteredNumber: 'MoMo registered number',
    payNow: 'Pay Now',
    processing: 'Processing...',
    paymentInitiated: 'Payment Initiated',
    checkPhoneForPrompt: 'Check your phone for MoMo prompt',
    paymentSuccessful: 'Payment Successful',
    paymentFailedMessage: 'Payment failed. Please try again.',
    paymentError: 'Payment error occurred',
    transactionId: 'Transaction ID',
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed',
    active: 'Active',
    available: 'Available',
    selected: 'Selected',
    select: 'Select',
    oneTime: 'One-time',
    expires: 'Expires',
    myServices: 'My Services',
    fillAllFields: 'Please fill all required fields',

    // Mentor Payments
    mentorPayments: 'Mentor Payments',
    managePaymentsAndEarnings: 'Manage your payments and earnings',
    totalEarnings: 'Total Earnings',
    pendingPayments: 'Pending Payments',
    completedSessions: 'Completed Sessions',
    fromLastMonth: 'from last month',
    awaitingCollection: 'Awaiting collection',
    thisMonth: 'This month',
    growth: 'Growth',
    monthOverMonth: 'Month over month',
    mentorshipSessions: 'Mentorship Sessions',
    manageSessionPayments: 'Manage session payments',
    paymentRequests: 'Payment Requests',
    trackPaymentRequests: 'Track your payment requests',
    createRequest: 'Create Request',
    createPaymentRequest: 'Create Payment Request',
    sendPaymentRequestToClient: 'Send payment request to client',
    clientPhoneNumber: 'Client Phone Number',
    clientMomoNumber: 'Client MoMo number',
    amount: 'Amount',
    description: 'Description',
    mentorshipSessionPayment: 'Mentorship session payment',
    creating: 'Creating...',
    requestPayment: 'Request Payment',
    noSessionsYet: 'No sessions yet',
    noPaymentRequestsYet: 'No payment requests yet',
    minutes: 'minutes',
    scheduled: 'Scheduled',
    created: 'Created',
    howItWorks: 'How it works',
    enterClientDetails: 'Enter client details and amount',
    clientReceivesPaymentPrompt: 'Client receives payment prompt on phone',
    paymentProcessedAutomatically: 'Payment processed automatically',
    fundsTransferredToAccount: 'Funds transferred to your account',
    paymentRequestSent: 'Payment request sent',
    clientWillReceivePrompt: 'Client will receive payment prompt',
    failedToCreateRequest: 'Failed to create payment request',
    failedToRequestPayment: 'Failed to request payment',
  },
  
  // French (Benin, Côte d'Ivoire, Guinea)
  'fr-BJ': {
    welcome: 'Bienvenue',
    login: 'Connexion',
    register: 'S\'inscrire',
    logout: 'Déconnexion',
    dashboard: 'Tableau de bord',
    profile: 'Profil',
    settings: 'Paramètres',
    help: 'Aide',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    cancel: 'Annuler',
    save: 'Enregistrer',
    continue: 'Continuer',
    back: 'Retour',
    next: 'Suivant',
    finish: 'Terminer',
    
    careerAssessment: 'Évaluation de carrière',
    cvGenerator: 'Générateur de CV',
    coverLetter: 'Lettre de motivation',
    aiServices: 'Services IA',
    jobSearch: 'Recherche d\'emploi',
    mentorship: 'Mentorat',
    communities: 'Communautés',
    
    aiServicesTitle: 'Services de carrière alimentés par l\'IA',
    aiServicesDescription: 'Boostez votre carrière avec nos outils IA',
    cvGeneratorService: 'Générateur de CV professionnel',
    coverLetterService: 'Générateur de lettre de motivation',
    jobAlertsService: 'Alertes d\'emploi personnalisées',
    payWithMomo: 'Payer avec MTN MoMo',
    serviceActive: 'Actif',
    servicePending: 'En attente',
    serviceExpired: 'Expiré',
    
    paymentTitle: 'Finaliser le paiement',
    paymentDescription: 'Payez en sécurité avec MTN Mobile Money',
    phoneNumber: 'Numéro de téléphone',
    paymentAmount: 'Montant',
    paymentSuccess: 'Paiement réussi!',
    paymentFailed: 'Échec du paiement. Veuillez réessayer.',
    paymentPending: 'Traitement du paiement...',
    
    jobSearchTitle: 'Trouvez l\'emploi de vos rêves',
    searchJobs: 'Rechercher des emplois',
    jobTitle: 'Titre du poste',
    company: 'Entreprise',
    location: 'Lieu',
    salary: 'Salaire',
    applyNow: 'Postuler maintenant',
    
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    phoneNumberLabel: 'Numéro de téléphone',
    
    welcomeMessage: 'Bienvenue sur CareerNest',
    loginSuccess: 'Connexion réussie!',
    registrationSuccess: 'Inscription réussie!',
    paymentProcessing: 'Traitement de votre paiement...',
    serviceActivated: 'Service activé avec succès!',
  },
  
  // Portuguese (Guinea-Bissau)
  'pt-GW': {
    welcome: 'Bem-vindo',
    login: 'Entrar',
    register: 'Registrar',
    logout: 'Sair',
    dashboard: 'Painel',
    profile: 'Perfil',
    settings: 'Configurações',
    help: 'Ajuda',
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    cancel: 'Cancelar',
    save: 'Salvar',
    continue: 'Continuar',
    back: 'Voltar',
    next: 'Próximo',
    finish: 'Finalizar',
    
    careerAssessment: 'Avaliação de Carreira',
    cvGenerator: 'Gerador de CV',
    coverLetter: 'Carta de Apresentação',
    aiServices: 'Serviços IA',
    jobSearch: 'Busca de Emprego',
    mentorship: 'Mentoria',
    communities: 'Comunidades',
    
    aiServicesTitle: 'Serviços de Carreira com IA',
    aiServicesDescription: 'Impulsione sua carreira com nossas ferramentas IA',
    cvGeneratorService: 'Gerador de CV Profissional',
    coverLetterService: 'Gerador de Carta de Apresentação',
    jobAlertsService: 'Alertas de Emprego Personalizados',
    payWithMomo: 'Pagar com MTN MoMo',
    serviceActive: 'Ativo',
    servicePending: 'Pendente',
    serviceExpired: 'Expirado',
    
    paymentTitle: 'Completar Pagamento',
    paymentDescription: 'Pague com segurança com MTN Mobile Money',
    phoneNumber: 'Número de Telefone',
    paymentAmount: 'Valor',
    paymentSuccess: 'Pagamento bem-sucedido!',
    paymentFailed: 'Falha no pagamento. Tente novamente.',
    paymentPending: 'Processando pagamento...',
    
    jobSearchTitle: 'Encontre o Emprego dos Seus Sonhos',
    searchJobs: 'Buscar Empregos',
    jobTitle: 'Título do Emprego',
    company: 'Empresa',
    location: 'Localização',
    salary: 'Salário',
    applyNow: 'Candidatar Agora',
    
    firstName: 'Primeiro Nome',
    lastName: 'Sobrenome',
    email: 'Email',
    password: 'Senha',
    confirmPassword: 'Confirmar Senha',
    phoneNumberLabel: 'Número de Telefone',
    
    welcomeMessage: 'Bem-vindo ao CareerNest',
    loginSuccess: 'Login bem-sucedido!',
    registrationSuccess: 'Registro bem-sucedido!',
    paymentProcessing: 'Processando seu pagamento...',
    serviceActivated: 'Serviço ativado com sucesso!',
  },
  
  // Yoruba (Nigeria & Benin)
  'yo-NG': {
    welcome: 'Káàbọ̀',
    login: 'Wọlé',
    register: 'Forúkọsilẹ̀',
    logout: 'Jáde',
    dashboard: 'Ojú-ìwé àkọ́kọ́',
    profile: 'Àpèjúwe',
    settings: 'Àtòpọ̀',
    help: 'Ìrànlọ́wọ́',
    loading: 'Ń gbé wá...',
    error: 'Àṣìṣe',
    success: 'Àṣeyọrí',
    cancel: 'Fagilee',
    save: 'Tọ́jú',
    continue: 'Tẹ̀síwájú',
    back: 'Padà',
    next: 'Tókàn',
    finish: 'Parí',
    
    careerAssessment: 'Àyẹ̀wò Iṣẹ́',
    cvGenerator: 'Olùṣẹ̀dá CV',
    coverLetter: 'Lẹ́tà Ìfihàn',
    aiServices: 'Àwọn Iṣẹ́ AI',
    jobSearch: 'Wíwá Iṣẹ́',
    mentorship: 'Ìtọ́nisọ́nà',
    communities: 'Àwọn Àgbègbè',
    
    aiServicesTitle: 'Àwọn Iṣẹ́ Iṣẹ́ pẹ̀lú AI',
    aiServicesDescription: 'Mú iṣẹ́ rẹ lọ sókè pẹ̀lú àwọn ohun èlò AI wa',
    cvGeneratorService: 'Olùṣẹ̀dá CV Ọjọgbọ́n',
    coverLetterService: 'Olùṣẹ̀dá Lẹ́tà Ìfihàn',
    jobAlertsService: 'Àwọn Ìkìlọ̀ Iṣẹ́ Ti ara ẹni',
    payWithMomo: 'Sanwó pẹ̀lú MTN MoMo',
    serviceActive: 'Ń ṣiṣẹ́',
    servicePending: 'Ń dúró',
    serviceExpired: 'Ti parí',
    
    paymentTitle: 'Parí Ìsanwó',
    paymentDescription: 'Sanwó ní àìléwu pẹ̀lú MTN Mobile Money',
    phoneNumber: 'Nọ́mbà Fóònù',
    paymentAmount: 'Iye owó',
    paymentSuccess: 'Ìsanwó ti yọrí sí rere!',
    paymentFailed: 'Ìsanwó kò yọrí sí rere. Jọ̀wọ́ gbìyànjú lẹ́ẹ̀kan sí i.',
    paymentPending: 'Ń ṣe ìsanwó...',
    
    jobSearchTitle: 'Wá Iṣẹ́ Àlá Rẹ',
    searchJobs: 'Wá Àwọn Iṣẹ́',
    jobTitle: 'Orúkọ Iṣẹ́',
    company: 'Ilé-iṣẹ́',
    location: 'Ibùdó',
    salary: 'Owó-oṣù',
    applyNow: 'Béèrè nísinsin yìí',
    
    firstName: 'Orúkọ àkọ́kọ́',
    lastName: 'Orúkọ ìdílé',
    email: 'Ímeèlì',
    password: 'Ọ̀rọ̀ aṣínà',
    confirmPassword: 'Jẹ́rìí Ọ̀rọ̀ aṣínà',
    phoneNumberLabel: 'Nọ́mbà Fóònù',
    
    welcomeMessage: 'Káàbọ̀ sí CareerNest',
    loginSuccess: 'Wíwọlé ti yọrí sí rere!',
    registrationSuccess: 'Ìforúkọsilẹ̀ ti yọrí sí rere!',
    paymentProcessing: 'Ń ṣe ìsanwó rẹ...',
    serviceActivated: 'Iṣẹ́ ti ṣiṣẹ́ ní àṣeyọrí!',
  },
  
  // Hausa (Nigeria)
  'ha': {
    welcome: 'Sannu',
    login: 'Shiga',
    register: 'Yi rajista',
    logout: 'Fita',
    dashboard: 'Dashboard',
    profile: 'Bayani',
    settings: 'Saiti',
    help: 'Taimako',
    loading: 'Ana lodawa...',
    error: 'Kuskure',
    success: 'Nasara',
    cancel: 'Soke',
    save: 'Ajiye',
    continue: 'Ci gaba',
    back: 'Koma baya',
    next: 'Na gaba',
    finish: 'Gama',
    
    careerAssessment: 'Gwajin Sana\'a',
    cvGenerator: 'Mai samar da CV',
    coverLetter: 'Wasikar neman aiki',
    aiServices: 'Sabis na AI',
    jobSearch: 'Neman aiki',
    mentorship: 'Jagora',
    communities: 'Al\'ummomi',
    
    aiServicesTitle: 'Sabis na sana\'a da AI',
    aiServicesDescription: 'Inganta sana\'ar ku da kayan aikin AI',
    cvGeneratorService: 'Mai samar da CV na kwararru',
    coverLetterService: 'Mai samar da wasikar neman aiki',
    jobAlertsService: 'Sanarwar aiki na musamman',
    payWithMomo: 'Biya da MTN MoMo',
    serviceActive: 'Yana aiki',
    servicePending: 'Yana jira',
    serviceExpired: 'Ya kare',
    
    paymentTitle: 'Kammala biyan kuɗi',
    paymentDescription: 'Biya cikin aminci da MTN Mobile Money',
    phoneNumber: 'Lambar waya',
    paymentAmount: 'Adadin kuɗi',
    paymentSuccess: 'Biyan kuɗi ya yi nasara!',
    paymentFailed: 'Biyan kuɗi ya gaza. Da fatan za ku sake gwadawa.',
    paymentPending: 'Ana aiwatar da biyan kuɗi...',
    
    jobSearchTitle: 'Nemo aikin da kuke so',
    searchJobs: 'Nemo ayyuka',
    jobTitle: 'Taken aiki',
    company: 'Kamfani',
    location: 'Wuri',
    salary: 'Albashi',
    applyNow: 'Nema yanzu',
    
    firstName: 'Suna na farko',
    lastName: 'Sunan iyali',
    email: 'Imel',
    password: 'Kalmar sirri',
    confirmPassword: 'Tabbatar da kalmar sirri',
    phoneNumberLabel: 'Lambar waya',
    
    welcomeMessage: 'Sannu zuwa CareerNest',
    loginSuccess: 'Shiga ya yi nasara!',
    registrationSuccess: 'Rajista ya yi nasara!',
    paymentProcessing: 'Ana aiwatar da biyan kuɗin ku...',
    serviceActivated: 'Sabis ya kunna da nasara!',
  },
  
  // Igbo (Nigeria)
  'ig': {
    welcome: 'Nnọọ',
    login: 'Banye',
    register: 'Debanye aha',
    logout: 'Pụọ',
    dashboard: 'Ebe nlekọta',
    profile: 'Nkọwa onwe',
    settings: 'Nhazi',
    help: 'Enyemaka',
    loading: 'Na-ebu...',
    error: 'Njehie',
    success: 'Ihe ịga nke ọma',
    cancel: 'Kagbuo',
    save: 'Chekwaa',
    continue: 'Gaa n\'ihu',
    back: 'Laghachi azụ',
    next: 'Osote',
    finish: 'Mechaa',
    
    careerAssessment: 'Nyocha ọrụ',
    cvGenerator: 'Onye na-emepụta CV',
    coverLetter: 'Akwụkwọ ozi mkpuchi',
    aiServices: 'Ọrụ AI',
    jobSearch: 'Ịchọ ọrụ',
    mentorship: 'Nduzi',
    communities: 'Obodo',
    
    aiServicesTitle: 'Ọrụ ọrụ nke AI na-akwado',
    aiServicesDescription: 'Kwalite ọrụ gị site na ngwa AI anyị',
    cvGeneratorService: 'Onye na-emepụta CV ọkachamara',
    coverLetterService: 'Onye na-emepụta akwụkwọ ozi mkpuchi',
    jobAlertsService: 'Ọkwa ọrụ ahaziri onwe',
    payWithMomo: 'Kwụọ ụgwọ na MTN MoMo',
    serviceActive: 'Na-arụ ọrụ',
    servicePending: 'Na-echere',
    serviceExpired: 'Agwụla',
    
    paymentTitle: 'Mechaa ịkwụ ụgwọ',
    paymentDescription: 'Kwụọ ụgwọ n\'enweghị nsogbu na MTN Mobile Money',
    phoneNumber: 'Nọmba ekwentị',
    paymentAmount: 'Ego ole',
    paymentSuccess: 'Ịkwụ ụgwọ gara nke ọma!',
    paymentFailed: 'Ịkwụ ụgwọ dara. Biko nwaa ọzọ.',
    paymentPending: 'Na-ahazi ịkwụ ụgwọ...',
    
    jobSearchTitle: 'Chọta ọrụ nrọ gị',
    searchJobs: 'Chọọ ọrụ',
    jobTitle: 'Aha ọrụ',
    company: 'Ụlọ ọrụ',
    location: 'Ebe',
    salary: 'Ụgwọ ọrụ',
    applyNow: 'Tinye akwụkwọ ugbu a',
    
    firstName: 'Aha mbụ',
    lastName: 'Aha ikpeazụ',
    email: 'Ozi-e',
    password: 'Okwu nzuzo',
    confirmPassword: 'Kwado okwu nzuzo',
    phoneNumberLabel: 'Nọmba ekwentị',
    
    welcomeMessage: 'Nnọọ na CareerNest',
    loginSuccess: 'Ịbanye gara nke ọma!',
    registrationSuccess: 'Ndebanye aha gara nke ọma!',
    paymentProcessing: 'Na-ahazi ịkwụ ụgwọ gị...',
    serviceActivated: 'Ọrụ rụrụ nke ọma!',
  },
  
  // Twi (Ghana)
  'tw': {
    welcome: 'Akwaaba',
    login: 'Kɔ mu',
    register: 'Kyerɛw wo din',
    logout: 'Fi mu',
    dashboard: 'Adwumayɛbea',
    profile: 'Wo ho nsɛm',
    settings: 'Nhyehyɛe',
    help: 'Mmoa',
    loading: 'Ɛreboa...',
    error: 'Mfomso',
    success: 'Nkonimdi',
    cancel: 'Gyae',
    save: 'Sie',
    continue: 'Kɔ so',
    back: 'San kɔ',
    next: 'Ɛtoɔ so',
    finish: 'Wie',
    
    careerAssessment: 'Adwuma ho nhwehwɛmu',
    cvGenerator: 'CV yɛfo',
    coverLetter: 'Krataa a ɛkata so',
    aiServices: 'AI nnwuma',
    jobSearch: 'Adwuma hwehwɛ',
    mentorship: 'Akwankyerɛ',
    communities: 'Mpɔtam',
    
    aiServicesTitle: 'AI adwuma nnwuma',
    aiServicesDescription: 'Ma w\'adwuma nkɔ anim wɔ yɛn AI nnwinnade so',
    cvGeneratorService: 'Osuafo CV yɛfo',
    coverLetterService: 'Krataa a ɛkata so yɛfo',
    jobAlertsService: 'Adwuma ho amanneɛ a wɔayɛ ama wo',
    payWithMomo: 'Tua ka wɔ MTN MoMo so',
    serviceActive: 'Ɛreyɛ adwuma',
    servicePending: 'Ɛretwɛn',
    serviceExpired: 'Aba awieɛ',
    
    paymentTitle: 'Wie sika tua',
    paymentDescription: 'Tua sika wɔ ahotɔ mu wɔ MTN Mobile Money so',
    phoneNumber: 'Telefon nɔma',
    paymentAmount: 'Sika dodoɔ',
    paymentSuccess: 'Sika tua kɔɔ yie!',
    paymentFailed: 'Sika tua ansi yie. Yɛ srɛ wo sɔ hwɛ bio.',
    paymentPending: 'Ɛreyɛ sika tua...',
    
    jobSearchTitle: 'Hwehwɛ w\'adwuma a wopɛ',
    searchJobs: 'Hwehwɛ nnwuma',
    jobTitle: 'Adwuma din',
    company: 'Adwumakuo',
    location: 'Beaeɛ',
    salary: 'Akatua',
    applyNow: 'Srɛ seesei',
    
    firstName: 'Din a ɛdi kan',
    lastName: 'Abusuadin',
    email: 'Imeɛl',
    password: 'Ahintasɛm',
    confirmPassword: 'Si ahintasɛm so dua',
    phoneNumberLabel: 'Telefon nɔma',
    
    welcomeMessage: 'Akwaaba bra CareerNest',
    loginSuccess: 'Kɔmu kɔɔ yie!',
    registrationSuccess: 'Din kyerɛw kɔɔ yie!',
    paymentProcessing: 'Ɛreyɛ wo sika tua...',
    serviceActivated: 'Ɛyɛɛ adwuma yie!',
  },

  // isiZulu (South Africa)
  'zu': {
    welcome: 'Sawubona',
    login: 'Ngena',
    register: 'Bhalisa',
    logout: 'Phuma',
    dashboard: 'Ibhodi',
    profile: 'Iphrofayela',
    settings: 'Izilungiselelo',
    help: 'Usizo',
    loading: 'Iyalayisha...',
    error: 'Iphutha',
    success: 'Impumelelo',
    cancel: 'Khansela',
    save: 'Londoloza',
    continue: 'Qhubeka',
    back: 'Buyela emuva',
    next: 'Okulandelayo',
    finish: 'Qeda',

    careerAssessment: 'Ukuhlolwa Komsebenzi',
    cvGenerator: 'Umkhiqizi we-CV',
    coverLetter: 'Incwadi Yokumboza',
    aiServices: 'Izinsizakalo ze-AI',
    jobSearch: 'Ukufuna Umsebenzi',
    mentorship: 'Ukuqeqeshwa',
    communities: 'Imiphakathi',

    aiServicesTitle: 'Izinsizakalo Zomsebenzi ze-AI',
    aiServicesDescription: 'Thuthukisa umsebenzi wakho ngamathuluzi ethu e-AI',
    cvGeneratorService: 'Umkhiqizi we-CV Ochwepheshe',
    coverLetterService: 'Umkhiqizi Wencwadi Yokumboza',
    jobAlertsService: 'Izaziso Zomsebenzi Eziqondene Nawe',
    payWithMomo: 'Khokha nge-MTN MoMo',
    serviceActive: 'Iyasebenza',
    servicePending: 'Ilinde',
    serviceExpired: 'Iphelelwe',

    paymentTitle: 'Qedela Inkokhelo',
    paymentDescription: 'Khokha ngokuphepha nge-MTN Mobile Money',
    phoneNumber: 'Inombolo Yefoni',
    paymentAmount: 'Imali',
    paymentSuccess: 'Inkokhelo iphumelele!',
    paymentFailed: 'Inkokhelo ihlulekile. Sicela uzame futhi.',
    paymentPending: 'Sicubungula inkokhelo...',

    jobSearchTitle: 'Thola Umsebenzi Wamaphupho Akho',
    searchJobs: 'Sesha Imisebenzi',
    jobTitle: 'Isihloko Somsebenzi',
    company: 'Inkampani',
    location: 'Indawo',
    salary: 'Umholo',
    applyNow: 'Faka Isicelo Manje',

    firstName: 'Igama Lokuqala',
    lastName: 'Isibongo',
    email: 'I-imeyili',
    password: 'Iphasiwedi',
    confirmPassword: 'Qinisekisa Iphasiwedi',
    phoneNumberLabel: 'Inombolo Yefoni',

    welcomeMessage: 'Sawubona ku-CareerNest',
    loginSuccess: 'Ukungena kuphumelele!',
    registrationSuccess: 'Ukubhalisa kuphumelele!',
    paymentProcessing: 'Sicubungula inkokhelo yakho...',
    serviceActivated: 'Insizakalo isebenza ngempumelelo!',
  },

  // Setswana (South Africa)
  'tn': {
    welcome: 'Dumela',
    login: 'Tsena',
    register: 'Kwala',
    logout: 'Tswa',
    dashboard: 'Boto ya taolo',
    profile: 'Profaele',
    settings: 'Dithulaganyo',
    help: 'Thuso',
    loading: 'E a loda...',
    error: 'Phoso',
    success: 'Katlego',
    cancel: 'Khansela',
    save: 'Boloka',
    continue: 'Tswelela',
    back: 'Boela morago',
    next: 'Se se latelang',
    finish: 'Fetsa',

    careerAssessment: 'Tekolo ya Tiro',
    cvGenerator: 'Motlhami wa CV',
    coverLetter: 'Lekwalo la go Akaretsa',
    aiServices: 'Ditirelo tsa AI',
    jobSearch: 'Go Batla Tiro',
    mentorship: 'Kaelo',
    communities: 'Ditšhaba',

    aiServicesTitle: 'Ditirelo tsa Tiro tsa AI',
    aiServicesDescription: 'Godisa tiro ya gago ka didirisiwa tsa rona tsa AI',
    cvGeneratorService: 'Motlhami wa CV wa Boitseanape',
    coverLetterService: 'Motlhami wa Lekwalo la go Akaretsa',
    jobAlertsService: 'Ditemoso tsa Tiro tse di Rulagantsweng',
    payWithMomo: 'Duela ka MTN MoMo',
    serviceActive: 'E a dira',
    servicePending: 'E emetse',
    serviceExpired: 'E fedile',

    paymentTitle: 'Fetsa Tefo',
    paymentDescription: 'Duela ka pabalesego ka MTN Mobile Money',
    phoneNumber: 'Nomoro ya Mogala',
    paymentAmount: 'Madi',
    paymentSuccess: 'Tefo e atlehile!',
    paymentFailed: 'Tefo e paletse. Ka kopo leka gape.',
    paymentPending: 'Re dira tefo...',

    jobSearchTitle: 'Batla Tiro ya Ditoro tsa Gago',
    searchJobs: 'Batla Ditiro',
    jobTitle: 'Setlhogo sa Tiro',
    company: 'Khampani',
    location: 'Lefelo',
    salary: 'Moputso',
    applyNow: 'Kopa Jaanong',

    firstName: 'Leina la Ntlha',
    lastName: 'Sefane',
    email: 'Imeile',
    password: 'Phasewete',
    confirmPassword: 'Netefatsa Phasewete',
    phoneNumberLabel: 'Nomoro ya Mogala',

    welcomeMessage: 'Dumela mo go CareerNest',
    loginSuccess: 'Go tsena go atlehile!',
    registrationSuccess: 'Go kwala go atlehile!',
    paymentProcessing: 'Re dira tefo ya gago...',
    serviceActivated: 'Tirelo e simolotse ka katlego!',
  },
};

// Add other language variants that use the same translations
translations['fr-CI'] = translations['fr-BJ'];
translations['fr-GN'] = translations['fr-BJ'];
translations['en-LR'] = translations['en-GH'];
translations['en-NG'] = translations['en-GH'];
translations['en-ZA'] = translations['en-GH'];
translations['yo-BJ'] = translations['yo-NG'];

export const getTranslation = (language: string, key: keyof TranslationKeys): string => {
  const langTranslations = translations[language] || translations[DEFAULT_LANGUAGE];
  return langTranslations[key] || translations['en-GH'][key];
};

export const DEFAULT_LANGUAGE = 'en-GH';
