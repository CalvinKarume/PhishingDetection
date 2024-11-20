import { Request, Response, NextFunction } from 'express';
import { 
  ValidationChain, 
  validationResult,
  ValidationError
} from 'express-validator';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const formattedErrors = errors.array().map((err: ValidationError) => ({
      field: 'path' in err ? err.path : 'unknown',
      message: err.msg
    }));

    res.status(400).json({ errors: formattedErrors });
  };
};

// Common validation rules
export const urlValidationRules = {
  url: {
    in: ['body'],
    isURL: {
      errorMessage: 'Must be a valid URL',
      options: {
        protocols: ['http', 'https'],
        require_protocol: true
      }
    },
    trim: true
  }
};

export const authValidationRules = {
  email: {
    in: ['body'],
    isEmail: {
      errorMessage: 'Must be a valid email address'
    },
    normalizeEmail: true,
    trim: true
  },
  password: {
    in: ['body'],
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password must be at least 6 characters long'
    }
  }
};