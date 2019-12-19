import * as assert from 'assert'
import * as Joi from '@hapi/joi'
import * as TYPES from './types'

/**
 * Converts the supplied joi validation object into a JSON schema object,
 * optionally applying a transformation.
 *
 * @param {JoiValidation} joi
 * @param {TransformFunction} [transformer=null]
 * @returns {JSONSchema}
 */
const convert = (joi, transformer = null) => {
    assert(
        'object' === typeof joi && true === Joi.isSchema(joi),
        'requires a joi schema object'
    )

    assert(joi.type, 'joi schema object must have a type')

    if (!TYPES[joi.type]) {
        throw new Error(
            `sorry, do not know how to convert unknown joi type: "${joi.type}"`
        )
    }

    if (transformer) {
        assert(
            'function' === typeof transformer,
            'transformer must be a function'
        )
    }

    // JSON Schema root for this type.
    const schema: any = {}

    // Copy over the details that all schemas may have...
    if (joi._description) {
        schema.description = joi._description
    }

    if (joi._examples && joi._examples.length > 0) {
        schema.examples = joi._examples.map(e => e.value)
    }

    if (joi._examples && joi._examples.length === 1) {
        schema.example = joi._examples[0].value
    }

    // Add the label as a title if it exists
    if (joi?._settings?.language?.label) {
        schema.title = joi._settings.language.label
    } else if (joi?._flags?.label) {
        schema.title = joi._flags.label
    }

    // Checking for undefined and null explicitly to allow false and 0 values
    if (
        joi._flags &&
        joi._flags.default !== undefined &&
        joi._flags.default !== null
    ) {
        schema['default'] = joi._flags.default
    }

    if (
        joi._valids &&
        joi._valids._set &&
        (joi._valids._set.size || joi._valids._set.length)
    ) {
        if (Array.isArray(joi._inner.children) || !joi._flags.allowOnly) {
            return {
                anyOf: [
                    {
                        type: joi.type,
                        enum: [...joi._valids._set]
                    },
                    TYPES[joi.type](schema, joi, transformer)
                ]
            }
        }
        schema['enum'] = [...joi._valids._set]
    }

    let result = TYPES[joi.type](schema, joi, transformer)

    if (transformer) {
        result = transformer(result, joi)
    }

    return result
}
convert.TYPES = TYPES
export default convert
/**
 * Joi Validation Object
 * @typedef {object} JoiValidation
 */

/**
 * Transformation Function - applied just before `convert()` returns and called as `function(object):object`
 * @typedef {function} TransformFunction
 */

/**
 * JSON Schema Object
 * @typedef {object} JSONSchema
 */
