import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { UserBox } from './user-box';

configure({ adapter: new Adapter() });

const mockData = {
    classes: {
        userBox: 'test',
        userEmail: 'kremlin@gmail.com'
    },
    user: {
        name: 'Vova Putin',
        photo: 'nttp://assets/img/path.jpg',
        email: 'kremlin@gmail.com'
    }
};

const component = (
    <UserBox {...mockData} />
);

describe('<UserBox />', () => {
    test('Snapshot <UserBox />', () => {
        const json = renderer.create(component).toJSON();
        expect(json).toMatchSnapshot();
    });

    test('Should render an <div /> tag', () => {
        expect(shallow(component).type()).toEqual('div');
    });

    test('Should render an <h2 /> tag', () => {
        expect(shallow(component).find('h2').length).toBe(1);
    });

    test('Should render an <img /> tag', () => {
        expect(shallow(component).find('img').length).toBe(1);
    });

    test('Should render an <p /> tag', () => {
        expect(shallow(component).find('p').length).toBe(1);
    });
});
