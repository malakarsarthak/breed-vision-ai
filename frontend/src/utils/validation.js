// Validation utilities for form inputs			

export const validateTagId = (tagId) => {
    // Indian animal tag ID format: IND followed by 12 digits			
    const tagIdRegex = /^IND\d{12}$/;

    if (!tagId) {
        return 'Tag ID is required';
    }

    if (!tagIdRegex.test(tagId)) {
        return 'Tag ID must be in format: IND followed by 12 digits (e.g., IND001234567890)';
    }

    return null;
};

export const validatePhone = (phone) => {
    // Indian phone number validation			
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phone) {
        return 'Phone number is required';
    }

    if (!phoneRegex.test(phone)) {
        return 'Please enter a valid 10-digit Indian mobile number';
    }

    return null;
};

export const validateAge = (age) => {
    const ageNum = parseInt(age);

    if (!age) {
        return 'Age is required';
    }

    if (isNaN(ageNum) || ageNum < 0 || ageNum > 300) {
        return 'Please enter a valid age in months (0-300)';
    }

    return null;
};

export const validateName = (name) => {
    if (!name) {
        return 'Name is required';
    }

    if (name.length < 2) {
        return 'Name must be at least 2 characters long';
    }

    if (name.length > 50) {
        return 'Name must be less than 50 characters';
    }

    return null;
};

export const validateImage = (imageFile) => {
    if (!imageFile) {
        return 'Animal image is required';
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(imageFile.type)) {
        return 'Please upload a valid image file (JPEG, PNG, or WebP)';
    }

    const maxSize = 5 * 1024 * 1024; // 5MB			
    if (imageFile.size > maxSize) {
        return 'Image size must be less than 5MB';
    }

    return null;
};

export const validateRequired = (value, fieldName) => {
    if (!value || value.toString().trim() === '') {
        return `${fieldName} is required`;
    }
    return null;
};

// Form validation helper			
export const validateAnimalForm = (formData) => {
    const errors = {};

    const tagIdError = validateTagId(formData.tagId);
    if (tagIdError) errors.tagId = tagIdError;

    const ownerNameError = validateName(formData.ownerName);
    if (ownerNameError) errors.ownerName = ownerNameError;

    const phoneError = validatePhone(formData.ownerPhone);
    if (phoneError) errors.ownerPhone = phoneError;

    const ageError = validateAge(formData.age);
    if (ageError) errors.age = ageError;

    const animalTypeError = validateRequired(formData.animalType, 'Animal type');
    if (animalTypeError) errors.animalType = animalTypeError;

    const sexError = validateRequired(formData.sex, 'Gender');
    if (sexError) errors.sex = sexError;

    const locationError = validateRequired(formData.location, 'Location');
    if (locationError) errors.location = locationError;

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};