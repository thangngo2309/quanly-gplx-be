import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({
    name: 'isGreaterDateOrEqual',
    async: false,
})
export class IsGreaterDateOrEqualConstraint
    implements ValidatorConstraintInterface {

    validate(expiryDate: any, args: ValidationArguments) {
        const dto = args.object as any;
        const relatedFieldName = args.constraints[0];
        const issueDate = dto[relatedFieldName];

        if (!issueDate || !expiryDate) return true;

        return new Date(issueDate) <= new Date(expiryDate);
    }

    defaultMessage(args: ValidationArguments) {
        const currentField = args.property;
        const compareField = args.constraints[0];

        return `${currentField} phải lớn hơn hoặc bằng ${compareField}`;
    }
}

export function GreaterDateOrEqual(
    property: string,
    validationOptions?: ValidationOptions,
) {
    return function (target: Object, propertyName: string) {
        registerDecorator({
            target: target.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: IsGreaterDateOrEqualConstraint,
        });
    };
}