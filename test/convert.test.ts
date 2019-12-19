import * as Joi from '@hapi/joi'
import convert from '../src/index'

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

// test('empty object will not allow additional properties', () => {
//     const joiSchema = Joi.object({})
//     const output = convert(joiSchema)
//     const target = {
//         type: 'object',
//         properties: {},
//         patterns: [],
//         additionalProperties: false
//     }
//     expect(output).toEqual(target)
// })

// test('object label', () => {
//     const joiSchema = Joi.object().label('Title')
//     const output = convert(joiSchema)
//     const target = {
//         type: 'object',
//         title: 'Title',
//         properties: {},
//         patterns: [],
//         additionalProperties: true
//     }
//     expect(output).toEqual(target)
// })

// // test('object options language label', () => {
// //     const joiSchema = Joi.object().options({
// //         language: {
// //             label: 'Title'
// //         }
// //     })
// //     const output = convert(joiSchema)
// //     const target = {
// //         type: 'object',
// //         title: 'Title',
// //         properties: {},
// //         patterns: [],
// //         additionalProperties: true
// //     }
// //     expect(output).toEqual(target)
// // })

// test('object description', () => {
//     const joiSchema = Joi.object().description('woot')
//     const output = convert(joiSchema)
//     const target = {
//         type: 'object',
//         properties: {},
//         patterns: [],
//         additionalProperties: true,
//         description: 'woot'
//     }
//     expect(output).toEqual(target)
// })

// test('object example', () => {
//     const joiSchema = Joi.object().example({ key: 'value' })
//     const output = convert(joiSchema)
//     const target = {
//         type: 'object',
//         properties: {},
//         patterns: [],
//         additionalProperties: true,
//         example: { key: 'value' },
//         examples: [{ key: 'value' }]
//     }
//     expect(output).toEqual(target)
// })

// test('object without unknown keys', () => {
//     const joi = Joi.object().unknown(false)
//     const output = convert(joi)
//     const target = {
//         type: 'object',
//         properties: {},
//         patterns: [],
//         additionalProperties: true
//     }
//     expect(output).toEqual(target)
// })

// test('object allow unknown', () => {
//     const joiSchema = Joi.object().unknown(true)
//     const output = convert(joiSchema)
//     const target = {
//         type: 'object',
//         properties: {},
//         patterns: [],
//         additionalProperties: true
//     }
//     expect(output).toEqual(target)
// })

// test('object', () => {
//     const joiSchema = Joi.object().keys({
//             string: Joi.string(),
//             'string default': Joi.string()
//                 .default('bar')
//                 .description('bar desc'),
//             number: Joi.number(),
//             boolean: Joi.boolean()
//         }),
//         output = convert(joiSchema),
//         target = {
//             type: 'object',
//             properties: {
//                 string: {
//                     type: 'string'
//                 },
//                 'string default': {
//                     type: 'string',
//                     default: 'bar',
//                     description: 'bar desc'
//                 },
//                 number: {
//                     type: 'number'
//                 },
//                 boolean: {
//                     type: 'boolean'
//                 }
//             },
//             patterns: [],
//             additionalProperties: false
//         }
//     expect(output).toEqual(target)
// })

//-----------------------------------

// test('object property required', function () {
//   let joi = Joi.object().keys({
//         string: Joi.string(),
//         'string default': Joi.string().default('bar').description('bar desc'),
//         'number': Joi.number(),
//         'boolean required': Joi.boolean().required()
//       }),
//       schema = convert(joi),
//       expected = {
//         type: 'object',
//         required: ['boolean required'],
//         properties: {
//           'string': {
//             type: 'string'
//           },
//           'string default': {
//             type: 'string',
//             'default': 'bar',
//             description: 'bar desc'
//           },
//           'number': {
//             type: 'number'
//           },
//           'boolean required': {
//             type: 'boolean'
//           }
//         },
//         patterns: [],
//         additionalProperties: false
//       }
//       expected(output).toEqual(target)
// })

// test('object property forbidden', function(){
//   let joi = Joi.object().keys({
//         string: Joi.string(),
//         'string default': Joi.string().default('bar').description('bar desc'),
//         'number forbidden': Joi.number().forbidden(),
//         'boolean required': Joi.boolean().required()
//       }),
//       schema = convert(joi),
//       expected = {
//         type: 'object',
//         required: ['boolean required'],
//         properties: {
//           'string': {
//             type: 'string'
//           },
//           'string default': {
//             type: 'string',
//             'default': 'bar',
//             description: 'bar desc'
//           },
//           'boolean required': {
//             type: 'boolean'
//           }
//         },
//         patterns: [],
//         additionalProperties: false,
//       }
//       expected(output).toEqual(target)
// })

// test('type: array', function () {
//   var joi = Joi.array(),
//       schema = convert(joi),
//       expected = {
//         type: 'array'
//       }
//   assert.validate(schema, expected)
// })

// test('enum', function () {
//   var joi = Joi.string().valid(['a', 'b']),
//       schema = convert(joi),
//       expected = {
//         'type': 'string',
//         'enum': ['a', 'b']
//       }
//   //console.log('.enum: %s', util.inspect({type: joi._type, schema: schema}, {depth: 10}))
//   expected(output).toEqual(target)
// })

// test('alternatives -> oneOf', function () {

//   let joi = Joi.object().keys({
//         value: Joi.alternatives().try(
//             Joi.string().valid('a'),
//             Joi.number().valid(100)
//         )
//       }),
//       schema = convert(joi),
//       expected = {
//         type: 'object',
//         patterns: [],
//         additionalProperties: false,
//         properties: {
//           value: {
//             oneOf: [
//               {
//                 type: 'string',
//                 'enum': ['a']
//               },
//               {
//                 type: 'number',
//                 'enum': [100]
//               }
//             ]
//           }
//         }
//       }

//   //console.log('alt -> oneOf: %s', util.inspect({type: joi._type, schema: schema}, {depth: 10}))
//   expected(output).toEqual(target)
// })

// test('string min/max', function () {
//   var joi = Joi.string().min(5).max(100),
//       schema = convert(joi),
//       expected = {
//         type: 'string',
//         minLength: 5,
//         maxLength: 100
//       }
//       expected(output).toEqual(target)
// })

// test('string -> maxLength', function () {
//   var joi = Joi.string().length(5),
//       schema = convert(joi),
//       expected = {
//         type: 'string',
//         maxLength: 5,
//         minLength: 5
//       }
//       expected(output).toEqual(target)
// })

// test('string email', function () {
//   var joi = Joi.string().email(),
//       schema = convert(joi),
//       expected = {
//         type: 'string',
//         format: 'email'
//       }
//       expected(output).toEqual(target)
// })

// test('string uri', function () {
//   var joi = Joi.string().uri(),
//       schema = convert(joi),
//       expected = {
//         type: 'string',
//         format: 'uri'
//       }
//       expected(output).toEqual(target)
// })

// test('date', function () {
//   var joi = Joi.date(),
//       schema = convert(joi),
//       expected = {
//         type: 'string',
//         format: 'date-time'
//       }
//       expected(output).toEqual(target)
// })

// test('date (javascript timestamp)', function () {
//   var joi = Joi.date().timestamp(),
//       schema = convert(joi),
//       expected = {
//         type: 'integer',
//       }
//       expected(output).toEqual(target)
// })

// test('date (unix timestamp)', function () {
//   var joi = Joi.date().timestamp('unix'),
//     schema = convert(joi),
//     expected = {
//       type: 'integer',
//     }
//     expected(output).toEqual(target)
// })

// test('string regex -> pattern', function () {
//   let joi = Joi.string().regex(/^[a-z]$/),
//       schema = convert(joi),
//       expected = {
//         type: 'string',
//         pattern: '^[a-z]$'
//       }
//       expected(output).toEqual(target)
// })

// test('string allow', function () {
//   let joi = Joi.string().allow(['a', 'b', '', null]),
//       schema = convert(joi),
//       expected = {
//         "anyOf": [
//           {
//             enum: [
//               'a',
//               'b',
//               '',
//               null,
//             ],
//             type: 'string'
//           },
//           {
//             type: 'string'
//           }
//         ]
//       }
//   //console.log('string allow: %s', util.inspect({type: joi._type, joi:joi, schema: schema}, {depth: 10}))
//   expected(output).toEqual(target)
// })

// test('number min/max', function () {
//   let joi = Joi.number().min(0).max(100),
//       schema = convert(joi),
//       expected = {
//         type: 'number',
//         minimum: 0,
//         maximum: 100
//       }
//       expected(output).toEqual(target)
// })

// test('number greater/less', function () {
//   let joi = Joi.number().greater(0).less(100),
//       schema = convert(joi),
//       expected = {
//         type: 'number',
//         minimum: 0,
//         exclusiveMinimum: true,
//         maximum: 100,
//         exclusiveMaximum: true
//       }
//       expected(output).toEqual(target)
// })

// test('number precision', function () {
//   let joi = Joi.number().precision(2),
//       schema = convert(joi),
//       expected = {
//         type: 'number',
//         multipleOf: 0.01
//       }
//       expected(output).toEqual(target)
// })

// test('integer', function () {
//   var joi = Joi.number().integer(),
//       schema = convert(joi),
//       expected = {
//         type: 'integer'
//       }
//       expected(output).toEqual(target)
// })

// test('array min/max', function () {
//   let joi = Joi.array().min(5).max(100),
//       schema = convert(joi),
//       expected = {
//         type: 'array',
//         minItems: 5,
//         maxItems: 100
//       }
//       expected(output).toEqual(target)
// })

// test('array length', function () {
//   let joi = Joi.array().length(100),
//       schema = convert(joi),
//       expected = {
//         type: 'array',
//         minItems: 100,
//         maxItems: 100
//       }
//       expected(output).toEqual(target)
// })

// test('array unique', function () {
//   let joi = Joi.array().unique(),
//       schema = convert(joi),
//       expected = {
//         type: 'array',
//         uniqueItems: true
//       }
//       expected(output).toEqual(target)
// })

// test('array inclusions', function () {
//   let joi = Joi.array().items(Joi.string()),
//       schema = convert(joi),
//       expected = {
//         type: 'array',
//         items: {type: 'string'}
//       }
//       expected(output).toEqual(target)
// })

// test('array ordered (tuple-like)', function () {
//   let joi = Joi.array().ordered(Joi.string().required(), Joi.number().optional()),
//       schema = convert(joi),
//       expected = {
//         type: 'array',
//         ordered: [{type: 'string'}, {type: 'number'}]
//       }
//       expected(output).toEqual(target)
// })

// test('joi any', function () {
//   let joi = Joi.any(),
//       schema = convert(joi),
//       expected = {
//         type: ['array', 'boolean', 'number', 'object', 'string', 'null']
//       }
//       expected(output).toEqual(target)
// })

// test('joi binary with content encoding', function () {
//   let joi = Joi.binary().encoding('base64'),
//     schema = convert(joi),
//     expected = {
//       type: 'string',
//       contentMediaType: 'text/plain',
//       contentEncoding: 'base64'
//     }
//     expected(output).toEqual(target)
// })

// test('joi binary with content type', function () {
//   let joi = Joi.binary().meta({ contentMediaType: 'image/png' }),
//     schema = convert(joi),
//     expected = {
//       type: 'string',
//       contentMediaType: 'image/png',
//       contentEncoding: 'binary'
//     }
//     expected(output).toEqual(target)
// })

// test('big and complicated', function () {
//   let joiSchema = Joi.object({
//         aFormattedString: Joi.string().regex(/^[ABC]_\w+$/),
//         aFloat: Joi.number().default(0.8).min(0.0).max(1.0),
//         anInt: Joi.number().required().precision(0).greater(0),
//         aForbiddenString: Joi.string().forbidden(),
//         anArrayOfFloats: Joi.array().items(Joi.number().default(0.8).min(0.0).max(1.0)),
//         anArrayOfNumbersOrStrings: Joi.array().items(Joi.alternatives(Joi.number(), Joi.string()))
//       }),
//   expected = require('./fixtures/complicated.json')
//   expect(convert(joiSchema)).toEqual(expected)
//   // now make it fail
//   expected.properties.aForbiddenString={type:'string'}

//   try {
//     assert.validate(schema,expected)
//   }
//   catch(e){
//     //console.warn(e)
//     if(e.name !== 'AssertionError' && e.operator !== 'deepEqual'){
//       throw e
//     }
//   }

// })

// test('joi.when', function () {
//   let joi = Joi.object({
//         'a': Joi.boolean().required().default(false),
//         'b': Joi.alternatives().when('a', {
//           is: true,
//           then: Joi.string().default('a is true'),
//           otherwise: Joi.number().default(0)
//         })
//       }),
//       schema = convert(joi),
//       expected = {
//         type: 'object',
//         properties: {
//           a: {
//             type: 'boolean',
//             default: false
//           },
//           b: {
//             oneOf: [
//               {
//                 'default': 'a is true',
//                 type: 'string'
//               }, {
//                 type: 'number',
//                 default: 0
//               }
//             ]
//           }
//         },
//         patterns: [],
//         additionalProperties: false,
//         required: ['a']
//       }
//   //console.log('when: %s', util.inspect({type:joi._type,schema:schema}, {depth: 10}))
//   expected(output).toEqual(target)
// })

// test('joi.options.presence = required', function () {
//     const reqJoi = Joi.defaults(schema => schema.options({
//         presence: 'required'
//     }))
//     const schema = reqJoi.object({
//         'name': reqJoi.string(),
//         'desc': reqJoi.string().optional()
//     })
//     assert.validate(convert(schema), {
//         additionalProperties: false,
//         patterns: [],
//         properties: {
//             name: {
//                 type: "string"
//             },
//             desc: {
//                 type: "string"
//             }
//         },
//         required: [
//             "name"
//         ],
//         type: "object"
//     })
// })
