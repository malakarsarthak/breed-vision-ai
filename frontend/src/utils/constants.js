// Constants for the application			

export const ANIMAL_TYPES = [
    { value: 'cattle', label: 'Cattle' },
    { value: 'buffalo', label: 'Buffalo' },
];

export const ANIMAL_GENDERS = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
];

export const INDIAN_CATTLE_BREEDS = [
    'Gir',
    'Holstein Friesian',
    'Jersey',
    'Red Sindhi',
    'Sahiwal',
    'Tharparkar',
    'Kankrej',
    'Ongole',
    'Hariana',
    'Krishna Valley',
    'Deoni',
    'Dangi',
    'Khillari',
    'Malvi',
    'Nimari',
    'Ponwar',
    'Rathi',
];

export const INDIAN_BUFFALO_BREEDS = [
    'Murrah',
    'Mehsana',
    'Jaffarabadi',
    'Surti',
    'Nagpuri',
    'Pandharpuri',
    'Toda',
    'Banni',
    'Chilika',
    'Kalahandi',
    'Marathwadi',
    'Sambalpuri',
];

export const ALL_BREEDS = [...INDIAN_CATTLE_BREEDS, ...INDIAN_BUFFALO_BREEDS];

export const REGISTRATION_STATUS = {
    PENDING: 'Pending Review',
    VERIFIED: 'Verified',
    REJECTED: 'Rejected',
    DRAFT: 'Draft',
};

export const CONFIDENCE_THRESHOLDS = {
    HIGH: 0.85,
    MEDIUM: 0.70,
    LOW: 0.50,
};

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        VERIFY: '/auth/verify',
    },
    ANIMALS: {
        REGISTER: '/animals/register',
        SEARCH: '/animals/search',
        GET_BY_ID: '/animals/:id',
        HISTORY: '/animals/history/:flwId',
        UPDATE: '/animals/:id',
    },
    BREEDS: {
        RECOGNIZE: '/breeds/recognize',
        RECOGNIZE_BASE64: '/breeds/recognize-base64',
        LIST: '/breeds/list',
        INFO: '/breeds/info/:breedName',
    },
    BPA: {
        SUBMIT: '/bpa/submit',
        VALIDATE: '/bpa/validate/:tagId',
        SYNC: '/bpa/sync',
    },
};

export const IMAGE_CONFIG = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB			
    ACCEPTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    COMPRESSION_QUALITY: 0.8,
};

export const FORM_STEPS = {
    ANIMAL_DETAILS: 0,
    IMAGE_CAPTURE: 1,
    BREED_RECOGNITION: 2,
    REVIEW_SUBMIT: 3,
};

export const USER_ROLES = {
    FLW: 'Field Level Worker',
    MAITRI: 'MAITRI Technician',
    VETERINARIAN: 'Veterinarian',
    SUPERVISOR: 'Supervisor',
    ADMIN: 'Administrator',
};

export const INDIAN_STATES = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
];

export const DATE_FORMATS = {
    DISPLAY: 'DD/MM/YYYY',
    API: 'YYYY-MM-DD',
    TIMESTAMP: 'YYYY-MM-DD HH:mm:ss',
};

export const MESSAGES = {
    SUCCESS: {
        REGISTRATION: 'Animal registered successfully!',
        LOGIN: 'Login successful!',
        LOGOUT: 'Logged out successfully!',
        UPDATE: 'Information updated successfully!',
        SYNC: 'Data synchronized with BPA successfully!',
    },
    ERROR: {
        NETWORK: 'Network error. Please check your internet connection.',
        AUTH: 'Authentication failed. Please login again.',
        VALIDATION: 'Please fill all required fields correctly.',
        IMAGE_UPLOAD: 'Failed to upload image. Please try again.',
        BREED_RECOGNITION: 'Breed recognition failed. Please try again.',
        REGISTRATION: 'Registration failed. Please try again.',
    },
    WARNING: {
        LOW_CONFIDENCE: 'AI confidence is low. Please verify breed manually.',
        OFFLINE: 'You are offline. Data will be synced when connection is restored.',
        UNSAVED_CHANGES: 'You have unsaved changes. Are you sure you want to leave?',
    },
};

export const BREED_CHARACTERISTICS = {
    'Gir': {
        origin: 'Gujarat',
        milkYield: '1,800-2,500 kg/lactation',
        features: 'Hardy, heat tolerant, distinctive lyre-shaped horns',
    },
    'Holstein Friesian': {
        origin: 'Netherlands (Crossbred)',
        milkYield: '6,000-8,000 kg/lactation',
        features: 'High milk production, black and white patches',
    },
    'Jersey': {
        origin: 'Jersey Island (Crossbred)',
        milkYield: '3,500-4,500 kg/lactation',
        features: 'Small size, high butterfat content',
    },
    'Murrah': {
        origin: 'Haryana',
        milkYield: '2,000-3,000 kg/lactation',
        features: 'High milk production, black color, curved horns',
    },
    // Add more breed characteristics as needed			
};

export default {
    ANIMAL_TYPES,
    ANIMAL_GENDERS,
    INDIAN_CATTLE_BREEDS,
    INDIAN_BUFFALO_BREEDS,
    ALL_BREEDS,
    REGISTRATION_STATUS,
    CONFIDENCE_THRESHOLDS,
    API_ENDPOINTS,
    IMAGE_CONFIG,
    FORM_STEPS,
    USER_ROLES,
    INDIAN_STATES,
    DATE_FORMATS,
    MESSAGES,
    BREED_CHARACTERISTICS,
};			