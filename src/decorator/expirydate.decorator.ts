import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({
  name: 'isExpiryDateValid',
  async: false,
})
export class IsExpiryDateValidConstraint
  implements ValidatorConstraintInterface
{

  validate(expiryDate: any, args: ValidationArguments) {
    const dto = args.object as any;
    // tên field cần đem ra so sánh, truyền vào decorator
    const relatedFieldName = args.constraints[0];
    // lấy giá trị của field đó
    const issueDate = dto[relatedFieldName];

    if (issueDate === undefined || expiryDate === undefined) {
      return true;
    }

    // So sánh ngày cấp và ngày hết hạn
    return new Date(issueDate) < new Date(expiryDate);
  }

  defaultMessage(args: ValidationArguments) {
    // tên field đang validate
    const currentField = args.property;
    // tên field dùng để so sánh, truyền vào decorator
    const compareField = args.constraints[0];

    return `${currentField} phải lớn hơn ${compareField}`;
  }
}

export function ExpiryDate(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (target: Object, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: IsExpiryDateValidConstraint,
    });
  };
}