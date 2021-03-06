'use strict';

var Qt = require('../support/Qt');
var assert = require('referee').assert;
var refute = require('referee').refute;
var qmlRectangleString = 'import QtQuick 2.0; Rectangle {}';
var qmlComponentString = 'import QtQuick 2.0; Component { Rectangle {} }';

describe('Qt', function () {

    it('should be registered as global', function () {
        assert.isObject(global.Qt);
    });

    describe('QtObject', function () {

        it('should be instantiable without a parent', function () {
            assert(new Qt.QtObject());
        });

        it('should be instantiable with a parent', function () {
            var parent = new Qt.QtObject();
            assert(new Qt.QtObject(parent));
        });

        it('should setup parent and children when created', function () {
            var parent = new Qt.QtObject();
            var child = new Qt.QtObject(parent);
            assert.same(child.parent, parent);
            assert.equals(parent.children, [child]);
        });

        it('should cleanup parent and children when destroyed', function () {
            var parent = new Qt.QtObject();
            var child = new Qt.QtObject(parent);
            child.destroy();
            refute(child.parent);
            assert.equals(parent.children, []);
        });

        it('should be serializable using JSON.stringify', function () {
            /*eslint no-new:0 */
            var parent = new Qt.QtObject();
            new Qt.QtObject(parent);
            assert.equals(JSON.stringify(parent), JSON.stringify({
                children: [{
                    children: [],
                    _type: 'QtObject'
                }],
                _type: 'QtObject'
            }));
        });

    });

    describe('createQmlObject', function () {

        it('should require a parent', function () {
            assert.exception(function () {
                Qt.createQmlObject(qmlRectangleString);
            }, { message: 'parent' });
        });

        it('should create instances of QtObject', function () {
            var parent = new Qt.QtObject();
            var item = Qt.createQmlObject(qmlRectangleString, parent);
            assert(item instanceof Qt.QtObject);
        });

        it('should set internal type based on Qml string', function () {
            var parent = new Qt.QtObject();
            var item = Qt.createQmlObject(qmlRectangleString, parent);
            assert.same(item._type, 'Rectangle');
        });

        it('should be able to create a component', function () {
            var parent = new Qt.QtObject();
            var component = Qt.createQmlObject(qmlComponentString, parent);
            assert.isFunction(component.createObject);
        });

    });

    describe('QtComponent', function () {
        it('should be able to create a objects with given parent and props', function () {
            var parent = new Qt.QtObject();
            var component = Qt.createQmlObject(qmlComponentString, parent);
            var obj = component.createObject(parent, { foo: 'bar' });
            assert.same(obj.parent, parent);
            assert.same(obj.foo, 'bar');
        });

    });
});
