import { bye } from '../../../src/bs/bye';
import { expect } from 'chai';
import 'mocha';

describe('Bye function', () => {

    it('should return bye world', () => {
        const result = bye();
        expect(result).to.equal('Bye world!');
    });

});