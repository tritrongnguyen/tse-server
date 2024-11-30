import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsClassPropertyValid(
  targetClass: any,
  validationOptions: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isClassPropertyValid',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [targetClass],
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value === undefined || value === null || value === '') {
            return true;
          }

          const [targetClass] = args.constraints;
          const validFields = Object.keys(new targetClass());
          return validFields.includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          const [targetClass] = args.constraints;
          const validFields = Object.keys(new targetClass());
          return `${args.property} must be one of: ${validFields.join(', ')}`;
        },
      },
    });
  };
}
