import * as Joi from '@hapi/joi'
import { convert } from '../src/index'
import * as fs from 'fs'
import * as path from 'path'

test('object defaults', () => {
    const joiSchema = Joi.object()
    const output = convert(joiSchema)
    const target = {
        type: 'object',
        properties: {},
        patterns: [],
        additionalProperties: true
    }
    expect(output).toEqual(target)
})

test('empty object will not allow additional properties', () => {
    const joiSchema = Joi.object({})
    const output = convert(joiSchema)
    const target = {
        type: 'object',
        properties: {},
        patterns: [],
        additionalProperties: false
    }
    expect(output).toEqual(target)
})

test('object label', () => {
    const joiSchema = Joi.object().label('Title')
    const output = convert(joiSchema)
    const target = {
        type: 'object',
        title: 'Title',
        properties: {},
        patterns: [],
        additionalProperties: true
    }
    expect(output).toEqual(target)
})

// Not fix yet
// test('object options language label', () => {
//     const joiSchema = Joi.object().options({
//         context: {
//             label: 'Title'
//         }
//     })
//     const output = convert(joiSchema)
//     const target = {
//         type: 'object',
//         title: 'Title',
//         properties: {},
//         patterns: [],
//         additionalProperties: true
//     }
//     // throw error: Cannot override context
//     expect(output).toEqual(target)
// })

test('object description', () => {
    const joiSchema = Joi.object().description('woot')
    const output = convert(joiSchema)
    const target = {
        type: 'object',
        properties: {},
        patterns: [],
        additionalProperties: true,
        description: 'woot'
    }
    expect(output).toEqual(target)
})

test('object example', () => {
    const joiSchema = Joi.object().example({ key: 'value' })
    const output = convert(joiSchema)
    const target = {
        type: 'object',
        properties: {},
        patterns: [],
        additionalProperties: true,
        example: { key: 'value' },
        examples: [{ key: 'value' }]
    }
    expect(output).toEqual(target)
})

test('object without unknown keys', () => {
    const joi = Joi.object().unknown(false)
    const output = convert(joi)
    const target = {
        type: 'object',
        properties: {},
        patterns: [],
        additionalProperties: true
    }
    expect(output).toEqual(target)
})

test('object allow unknown', () => {
    const joiSchema = Joi.object().unknown(true)
    const output = convert(joiSchema)
    const target = {
        type: 'object',
        properties: {},
        patterns: [],
        additionalProperties: true
    }
    expect(output).toEqual(target)
})

test('object', () => {
    const joiSchema = Joi.object().keys({
        string: Joi.string(),
        'string default': Joi.string()
            .default('bar')
            .description('bar desc'),
        number: Joi.number(),
        boolean: Joi.boolean()
    })
    const output = convert(joiSchema)
    const target = {
        type: 'object',
        properties: {
            string: {
                type: 'string'
            },
            'string default': {
                type: 'string',
                default: 'bar',
                description: 'bar desc'
            },
            number: {
                type: 'number'
            },
            boolean: {
                type: 'boolean'
            }
        },
        patterns: [],
        additionalProperties: false
    }
    expect(output).toEqual(target)
})

test('object property required', () => {
    const joiSchema = Joi.object().keys({
        string: Joi.string(),
        'string default': Joi.string()
            .default('bar')
            .description('bar desc'),
        number: Joi.number(),
        'boolean required': Joi.boolean().required()
    })
    const output = convert(joiSchema)
    const target = {
        type: 'object',
        required: ['boolean required'],
        properties: {
            string: {
                type: 'string'
            },
            'string default': {
                type: 'string',
                default: 'bar',
                description: 'bar desc'
            },
            number: {
                type: 'number'
            },
            'boolean required': {
                type: 'boolean'
            }
        },
        patterns: [],
        additionalProperties: false
    }
    expect(output).toEqual(target)
})

test('object property forbidden', () => {
    const joiSchema = Joi.object().keys({
        string: Joi.string(),
        'string default': Joi.string()
            .default('bar')
            .description('bar desc'),
        'number forbidden': Joi.number().forbidden(),
        'boolean required': Joi.boolean().required()
    })
    const output = convert(joiSchema)
    const target = {
        type: 'object',
        required: ['boolean required'],
        properties: {
            string: {
                type: 'string'
            },
            'string default': {
                type: 'string',
                default: 'bar',
                description: 'bar desc'
            },
            'boolean required': {
                type: 'boolean'
            }
        },
        patterns: [],
        additionalProperties: false
    }
    expect(output).toEqual(target)
})

test('type: array', () => {
    const joiSchema = Joi.array()
    const output = convert(joiSchema)
    const target = {
        type: 'array'
    }
    expect(output).toEqual(target)
})

test('enum', () => {
    const joiSchema = Joi.string().valid('a', 'b')
    const output = convert(joiSchema)
    const target = {
        type: 'string',
        enum: ['a', 'b']
    }
    expect(output).toEqual(target)
})

test('alternatives -> oneOf', () => {
    const joiSchema = Joi.object().keys({
        value: Joi.alternatives().try(
            Joi.string().valid('a'),
            Joi.number().valid(100)
        )
    })
    const output = convert(joiSchema)
    const target = {
        type: 'object',
        patterns: [],
        additionalProperties: false,
        properties: {
            value: {
                oneOf: [
                    {
                        type: 'string',
                        enum: ['a']
                    },
                    {
                        type: 'number',
                        enum: [100]
                    }
                ]
            }
        }
    }
    expect(output).toEqual(target)
})

test('string min/max', () => {
    const joiSchema = Joi.string().min(5).max(100)
    const output = convert(joiSchema)
    const target = {
        type: 'string',
        minLength: 5,
        maxLength: 100
    }
    expect(output).toEqual(target)
})

test('string -> maxLength', () => {
    const joiSchema = Joi.string().length(5)
    const output = convert(joiSchema)
    const target = {
        type: 'string',
        maxLength: 5,
        minLength: 5
    }
    expect(output).toEqual(target)
})

test('string email', () => {
    const joiSchema = Joi.string().email()
    const output = convert(joiSchema)
    const target = {
        type: 'string',
        format: 'email'
    }
    expect(output).toEqual(target)
})

test('string uri', () => {
    const joiSchema = Joi.string().uri()
    const output = convert(joiSchema)
    const target = {
        type: 'string',
        format: 'uri'
    }
    expect(output).toEqual(target)
})

test('date', () => {
    const joiSchema = Joi.date()
    const output = convert(joiSchema)
    const target = {
        type: 'string',
        format: 'date-time'
    }
    expect(output).toEqual(target)
})

test('date (javascript timestamp)', () => {
    const joiSchema = Joi.date().timestamp()
    const output = convert(joiSchema)
    const target = {
        type: 'integer'
    }
    expect(output).toEqual(target)
})

test('date (unix timestamp)', () => {
    const joiSchema = Joi.date().timestamp('unix')
    const output = convert(joiSchema)
    const target = {
        type: 'integer'
    }
    expect(output).toEqual(target)
})

test('string regex -> pattern', () => {
    const joiSchema = Joi.string().regex(/^[a-z]$/)
    const output = convert(joiSchema)
    const target = {
        type: 'string',
        pattern: '^[a-z]$'
    }
    expect(output).toEqual(target)
})

test('string allow', () => {
    const joiSchema = Joi.string().allow('a', 'b', '', null)
    const output = convert(joiSchema)
    const target = {
        anyOf: [
            {
                enum: ['a', 'b', '', null],
                type: 'string'
            },
            {
                type: 'string'
            }
        ]
    }
    expect(output).toEqual(target)
})

test('number min/max', () => {
    const joiSchema = Joi.number().min(0).max(100)
    const output = convert(joiSchema)
    const target = {
        type: 'number',
        minimum: 0,
        maximum: 100
    }
    expect(output).toEqual(target)
})

test('number greater/less', () => {
    const joiSchema = Joi.number().greater(0).less(100)
    const output = convert(joiSchema)
    const target = {
        type: 'number',
        minimum: 0,
        exclusiveMinimum: true,
        maximum: 100,
        exclusiveMaximum: true
    }
    expect(output).toEqual(target)
})

test('number precision', () => {
    const joiSchema = Joi.number().precision(2)
    const output = convert(joiSchema)
    const target = {
        type: 'number',
        multipleOf: 0.01
    }
    expect(output).toEqual(target)
})

test('integer', () => {
    const joiSchema = Joi.number().integer()
    const output = convert(joiSchema)
    const target = {
        type: 'integer'
    }
    expect(output).toEqual(target)
})

test('array min/max', () => {
    const joiSchema = Joi.array().min(5).max(100)
    const output = convert(joiSchema)
    const target = {
        type: 'array',
        minItems: 5,
        maxItems: 100
    }
    expect(output).toEqual(target)
})

test('array length', () => {
    const joiSchema = Joi.array().length(100)
    const output = convert(joiSchema)
    const target = {
        type: 'array',
        minItems: 100,
        maxItems: 100
    }
    expect(output).toEqual(target)
})

test('array unique', () => {
    const joiSchema = Joi.array().unique()
    const output = convert(joiSchema)
    const target = {
        type: 'array',
        uniqueItems: true
    }
    expect(output).toEqual(target)
})

test('array inclusions', () => {
    const joiSchema = Joi.array().items(Joi.string())
    const output = convert(joiSchema)
    const target = {
        type: 'array',
        items: { type: 'string' }
    }
    expect(output).toEqual(target)
})

test('array ordered (tuple-like)', () => {
    const joiSchema = Joi.array().ordered(
        Joi.string().required(),
        Joi.number().optional()
    )
    const output = convert(joiSchema)
    const target = {
        type: 'array',
        ordered: [{ type: 'string' }, { type: 'number' }]
    }
    expect(output).toEqual(target)
})

test('joi any', () => {
    const joiSchema = Joi.any()
    const output = convert(joiSchema)
    const target = {
        type: ['array', 'boolean', 'number', 'object', 'string', 'null']
    }
    expect(output).toEqual(target)
})

test('joi binary with content encoding', () => {
    const joiSchema = Joi.binary().encoding('base64')
    const output = convert(joiSchema)
    const target = {
        type: 'string',
        contentMediaType: 'text/plain',
        contentEncoding: 'base64'
    }
    expect(output).toEqual(target)
})

test('joi binary with content type', () => {
    const joiSchema = Joi.binary().meta({ contentMediaType: 'image/png' })
    const output = convert(joiSchema)
    const target = {
        type: 'string',
        contentMediaType: 'image/png',
        contentEncoding: 'binary'
    }
    expect(output).toEqual(target)
})

test('big and complicated', () => {
    const joiSchema = Joi.object({
        aFormattedString: Joi.string().regex(/^[ABC]_\w+$/),
        aFloat: Joi.number().default(0.8).min(0.0).max(1.0),
        anInt: Joi.number().required().precision(0).greater(0),
        aForbiddenString: Joi.string().forbidden(),
        anArrayOfFloats: Joi.array().items(
            Joi.number().default(0.8).min(0.0).max(1.0)
        ),
        anArrayOfNumbersOrStrings: Joi.array().items(
            Joi.alternatives(Joi.number(), Joi.string())
        )
    })
    const output = convert(joiSchema)
    const target = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, './complicated.json'), 'utf-8')
    )
    expect(output).toEqual(target)
})

test('joi.when', () => {
    const joiSchema = Joi.object({
        a: Joi.boolean()
            .required()
            .default(false),
        b: Joi.alternatives().conditional('a', {
            is: true,
            then: Joi.string().default('a is true'),
            otherwise: Joi.number().default(0)
        })
    })
    const output = convert(joiSchema)
    const target = {
        type: 'object',
        properties: {
            a: {
                type: 'boolean',
                default: false
            },
            b: {
                oneOf: [
                    {
                        default: 'a is true',
                        type: 'string'
                    },
                    {
                        type: 'number',
                        default: 0
                    }
                ]
            }
        },
        patterns: [],
        additionalProperties: false,
        required: ['a']
    }
    expect(output).toEqual(target)
})

test('joi.options.presence = required', () => {
    const reqJoi = Joi.defaults(schema =>
        schema.options({
            presence: 'required'
        })
    )
    const joiSchema = reqJoi.object({
        name: reqJoi.string(),
        desc: reqJoi.string().optional()
    })
    const output = convert(joiSchema)
    const target = {
        additionalProperties: false,
        patterns: [],
        properties: {
            name: {
                type: 'string'
            },
            desc: {
                type: 'string'
            }
        },
        required: ['name'],
        type: 'object'
    }
    expect(output).toEqual(target)
})
