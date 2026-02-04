---
title: deepClone in javascript
date: "2025-01-15"
excerpt: deepClone in javascript
tags:
  - deepClone
  - javascript
coverEmoji: 
---
# deepClone

A robust, cyclic-reference-safe deep-clone utility for JavaScript/TypeScript.

## Implementation

```js
/**
 * Deep-clone any JavaScript value (Object, Array, Function, primitive, etc.).
 * Handles cyclic references via WeakMap.
 * Preserves property descriptors and prototype chain.
 *
 * @param {*} target  The value to clone
 * @returns {*}       A deep-cloned copy
 */
function deepClone(target) {
    const map = new WeakMap();

    function isObject(target) {
        return (typeof target === 'object' && target) || typeof target === 'function';
    }

    function clone(data) {
        if (!isObject(data)) {
            return data;
        }

        if (typeof data === 'function') {
            // Clone a function by re-compiling it
            return new Function('return ' + data.toString())();
        }

        // Handle cyclic references
        const exist = map.get(data);
        if (exist) {
            return exist;
        }

        // Preserve prototypes + property descriptors
        const keys     = Reflect.ownKeys(data);
        const allDesc  = Object.getOwnPropertyDescriptors(data);
        const result   = Object.create(Object.getPrototypeOf(data), allDesc);

        map.set(data, result);

        // Recursively clone nested values
        keys.forEach(key =&gt; {
            const val = data[key];
            result[key] = isObject(val) ? clone(val) : val;
        });

        return result;
    }

    return clone(target);
}

/* ---------- usage demo ---------- */
// const a = { b: '132', c: 123 };
// const b = deepClone(a);
// console.log(a === b); // false