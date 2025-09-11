/**
 * 基于策略模式的验证系统 - 通用且可扩展
 */

import { TypeProperty } from './openapi-parser';

/**
 * 验证策略接口
 */
export interface ValidationStrategy {
  /**
   * 检查是否适用于该字段
   */
  matches(fieldName: string, property: TypeProperty): boolean;
  
  /**
   * 生成验证代码
   */
  generateValidation(fieldName: string, property: TypeProperty): string;
  
  /**
   * 策略优先级 (数字越小优先级越高)
   */
  priority: number;
}

/**
 * 基础类型验证策略
 */
export class TypeValidationStrategy implements ValidationStrategy {
  priority = 100;

  matches(fieldName: string, property: TypeProperty): boolean {
    return ['string', 'number', 'boolean', 'array', 'object'].includes(property.type);
  }

  generateValidation(fieldName: string, property: TypeProperty): string {
    let code = '';

    // Required field validation
    if (property.required) {
      code += `  if (request.${fieldName} === undefined || request.${fieldName} === null) {
    throw new Error('Field ${fieldName} is required');
  }
`;
    }

    // Basic type validation
    const typeMapping: Record<string, string> = {
      'string': 'string',
      'number': 'number', 
      'boolean': 'boolean',
      'array': 'object',
      'object': 'object'
    };

    const jsType = typeMapping[property.type];
    if (jsType) {
      const typeCheck = property.type === 'array' 
        ? `Array.isArray(request.${fieldName})`
        : `typeof request.${fieldName} === '${jsType}'`;
        
      code += `  if (request.${fieldName} !== undefined && !${typeCheck}) {
    throw new Error('Field ${fieldName} must be of type ${property.type}');
  }
`;
    }

    return code;
  }

  private getTypeDisplayName(type: string): string {
    const mapping: Record<string, string> = {
      'string': 'string',
      'number': 'number',
      'boolean': 'boolean',
      'array': 'array',
      'object': 'object'
    };
    return mapping[type] || type;
  }
}

/**
 * OpenAPI 格式验证策略
 */
export class FormatValidationStrategy implements ValidationStrategy {
  priority = 50;

  matches(fieldName: string, property: TypeProperty): boolean {
    return property.type === 'string' && !!property.format;
  }

  generateValidation(fieldName: string, property: TypeProperty): string {
    const formatValidators: Record<string, { regex: RegExp; message: string }> = {
      'email': {
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'email format'
      },
      'uri': {
        regex: /^https?:\/\/.+/,
        message: 'URI format'
      },
      'date': {
        regex: /^\d{4}-\d{2}-\d{2}$/,
        message: 'date format (YYYY-MM-DD)'
      },
      'date-time': {
        regex: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/,
        message: 'date-time format (ISO 8601)'
      }
    };

    const validator = formatValidators[property.format!];
    if (!validator) {
      return '';
    }

    return `  if (request.${fieldName} !== undefined && !${validator.regex}.test(request.${fieldName})) {
    throw new Error('Field ${fieldName} must match ${validator.message}');
  }
`;
  }
}

/**
 * OpenAPI 数值范围验证策略
 */
export class NumericRangeValidationStrategy implements ValidationStrategy {
  priority = 50;

  matches(fieldName: string, property: TypeProperty): boolean {
    return property.type === 'number' && (
      property.minimum !== undefined || 
      property.maximum !== undefined ||
      property.exclusiveMinimum !== undefined ||
      property.exclusiveMaximum !== undefined
    );
  }

  generateValidation(fieldName: string, property: TypeProperty): string {
    let code = '';

    if (property.minimum !== undefined) {
      code += `  if (request.${fieldName} !== undefined && request.${fieldName} < ${property.minimum}) {
    throw new Error('Field ${fieldName} must be greater than or equal to ${property.minimum}');
  }
`;
    }

    if (property.maximum !== undefined) {
      code += `  if (request.${fieldName} !== undefined && request.${fieldName} > ${property.maximum}) {
    throw new Error('Field ${fieldName} must be less than or equal to ${property.maximum}');
  }
`;
    }

    if (property.exclusiveMinimum !== undefined) {
      code += `  if (request.${fieldName} !== undefined && request.${fieldName} <= ${property.exclusiveMinimum}) {
    throw new Error('Field ${fieldName} must be greater than ${property.exclusiveMinimum}');
  }
`;
    }

    if (property.exclusiveMaximum !== undefined) {
      code += `  if (request.${fieldName} !== undefined && request.${fieldName} >= ${property.exclusiveMaximum}) {
    throw new Error('Field ${fieldName} must be less than ${property.exclusiveMaximum}');
  }
`;
    }

    return code;
  }
}

/**
 * OpenAPI 字符串长度验证策略
 */
export class StringLengthValidationStrategy implements ValidationStrategy {
  priority = 50;

  matches(fieldName: string, property: TypeProperty): boolean {
    return property.type === 'string' && (
      property.minLength !== undefined || 
      property.maxLength !== undefined
    );
  }

  generateValidation(fieldName: string, property: TypeProperty): string {
    let code = '';

    if (property.minLength !== undefined) {
      code += `  if (request.${fieldName} !== undefined && request.${fieldName}.length < ${property.minLength}) {
    throw new Error('Field ${fieldName} length must be greater than or equal to ${property.minLength}');
  }
`;
    }

    if (property.maxLength !== undefined) {
      code += `  if (request.${fieldName} !== undefined && request.${fieldName}.length > ${property.maxLength}) {
    throw new Error('Field ${fieldName} length must be less than or equal to ${property.maxLength}');
  }
`;
    }

    return code;
  }
}

/**
 * OpenAPI 数组验证策略
 */
export class ArrayValidationStrategy implements ValidationStrategy {
  priority = 50;

  matches(fieldName: string, property: TypeProperty): boolean {
    return property.type === 'array' && (
      property.minItems !== undefined || 
      property.maxItems !== undefined ||
      !!property.uniqueItems
    );
  }

  generateValidation(fieldName: string, property: TypeProperty): string {
    let code = '';

    if (property.minItems !== undefined) {
      code += `  if (request.${fieldName} !== undefined && request.${fieldName}.length < ${property.minItems}) {
    throw new Error('Field ${fieldName} array length must be greater than or equal to ${property.minItems}');
  }
`;
    }

    if (property.maxItems !== undefined) {
      code += `  if (request.${fieldName} !== undefined && request.${fieldName}.length > ${property.maxItems}) {
    throw new Error('Field ${fieldName} array length must be less than or equal to ${property.maxItems}');
  }
`;
    }

    if (property.uniqueItems) {
      code += `  if (request.${fieldName} !== undefined && new Set(request.${fieldName}).size !== request.${fieldName}.length) {
    throw new Error('Field ${fieldName} array elements must be unique');
  }
`;
    }

    return code;
  }
}

/**
 * OpenAPI Pattern 验证策略
 */
export class PatternValidationStrategy implements ValidationStrategy {
  priority = 30;

  matches(fieldName: string, property: TypeProperty): boolean {
    return property.type === 'string' && !!property.pattern;
  }

  generateValidation(fieldName: string, property: TypeProperty): string {
    return `  if (request.${fieldName} !== undefined && !/${property.pattern}/.test(request.${fieldName})) {
    throw new Error('Field ${fieldName} format does not match required pattern');
  }
`;
  }
}

/**
 * 验证策略管理器
 */
export class ValidationStrategyManager {
  private strategies: ValidationStrategy[] = [
    new TypeValidationStrategy(),
    new FormatValidationStrategy(),
    new NumericRangeValidationStrategy(),
    new StringLengthValidationStrategy(),
    new ArrayValidationStrategy(),
    new PatternValidationStrategy()
  ];

  /**
   * 添加自定义验证策略
   */
  addStrategy(strategy: ValidationStrategy): void {
    this.strategies.push(strategy);
    this.strategies.sort((a, b) => a.priority - b.priority);
  }

  /**
   * 为字段生成验证代码
   */
  generateValidation(fieldName: string, property: TypeProperty): string {
    let code = '';
    
    for (const strategy of this.strategies) {
      if (strategy.matches(fieldName, property)) {
        code += strategy.generateValidation(fieldName, property);
      }
    }

    return code;
  }
}
