const { logger, LEVELS } = require('./logger');

describe('Logger\'s', function() {

  describe('constructor', function() {
    it('should store optional root config', () => {
      const facilityValue = 'a';
      const zoneValue = 'b';
      const myLogger = new logger({
        root: {
          facility: facilityValue,
          zone: zoneValue
        }
      });

      expect(myLogger.root.facility).toBe(facilityValue);
      expect(myLogger.root.zone).toBe(zoneValue);
    });
    
    it('should store optional format override', () => {
      const formatOverride = () => ( "abc" );
      const myLogger = new logger({ format: formatOverride });

      expect(Object.is(myLogger.format, formatOverride)).toBe(true);
    });

    it('should store optional transport override', () => {
      const transportOverride = () => ( "abc" );
      const myLogger = new logger({ transport: transportOverride });

      expect(Object.is(myLogger.transport, transportOverride)).toBe(true);
    });
  });

  describe('createLogObject()', function() {
    it('should create object with root info, log data, and log level', () => {
      const rootTest = 'test';
      const myVal = 'myVal';

      const myLogger = new logger({ root: rootTest });
      const res = myLogger.createLogObject({ myKey: myVal }, LEVELS.DEBUG);

      expect(res).toEqual({
        root: rootTest,
        myKey: myVal,
        level: LEVELS.DEBUG
      });
    });

    it('should convert string data to object with message key', () => {
      const myLogger = new logger();
      const res = myLogger.createLogObject('string data');

      expect(res).toEqual({
        root: 'root',
        message: 'string data',
        level: LEVELS.INFO
      });
    });

    it('should default to info log level', () => {
      const myLogger = new logger();
      const res = myLogger.createLogObject({
        a: 'b'
      });

      expect(res.level).toBe(LEVELS.INFO);
    });
  });

  describe('log()', function() {

    it('should utilize configurable custom format function', () => {
      const fakeFormat = jest.fn();
      const fakeTransport = jest.fn();
      const msg = 'a';

      const myLogger = new logger({
        format: fakeFormat,
        transport: fakeTransport // just so nothing logs to console
      });
      myLogger.log(msg, LEVELS.DEBUG);

      // configurable format is called
      expect(fakeFormat.mock.calls.length).toEqual(1);
      // configurable format received params correctly
      expect(fakeFormat.mock.calls).toEqual(
        [[{
          root: 'root', message: msg, level: LEVELS.DEBUG
        }]]
      );
    });

    it('should utilize configurable transport function', () => {
      const fakeTransport = jest.fn();
      const msg = 'a';

      const myLogger = new logger({
        transport: fakeTransport
      });
      myLogger.log(msg, LEVELS.WARN);

      // configurable transport is called
      expect(fakeTransport.mock.calls.length).toEqual(1);
      // configurable transport received params correctly
      expect(fakeTransport.mock.calls).toEqual([[
        LEVELS.WARN,
        JSON.stringify({ // default format stringify's obj
          root: 'root',
          message: msg,
          level: LEVELS.WARN
        })
      ]]);
    });

  });

});
