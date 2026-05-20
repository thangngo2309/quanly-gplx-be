import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function IsValidRegistrationNumber(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isValidRegistrationNumber',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: string) {
                    const match = value?.match(/^([0-9]{2})[A-Z]-[0-9]{3}\.[0-9]{2}$/) 
                    || value?.match(/^([0-9]{2})[A-Z]-[0-9]{4}$/);
                    if (!match) return false;
                    return true;
                },

                defaultMessage(args: ValidationArguments) {
                    return 'Biển số xe không đúng định dạng';
                },
            },
        });
    };
}