import { expect } from 'chai';
import { mountJsonForms } from '../util';

const schema = {
  type: 'string',
  title: 'My OneOf Enum',
  oneOf: [
    { const: 'foo', title: 'Foo' },
    { const: 'bar', title: 'Bar' },
    { const: 'foobar', title: 'FooBar' },
  ],
};

const uischema = {
  type: 'Control',
  scope: '#',
  options: {
    format: 'radio',
  },
};

const uischemaWithoutRadio = {
  type: 'Control',
  scope: '#',
};

describe('OneOfRadioGroupControlRenderer.vue', () => {
  it('renders radio inputs when format is radio', () => {
    const wrapper = mountJsonForms('foo', schema, uischema);
    const radioInputs = wrapper.findAll('input[type="radio"]');
    expect(radioInputs.length).to.equal(3);
  });

  it('does not render when format is not radio', () => {
    const wrapper = mountJsonForms('foo', schema, uischemaWithoutRadio);
    const radioInputs = wrapper.findAll('input[type="radio"]');
    expect(radioInputs.length).to.equal(0);
  });

  it('renders fieldset and legend', () => {
    const wrapper = mountJsonForms('foo', schema, uischema);
    expect(wrapper.find('fieldset').exists()).to.be.true;
    expect(wrapper.find('legend').exists()).to.be.true;
    expect(wrapper.find('legend').text()).to.equal('My OneOf Enum');
  });

  it('renders labels for each option', () => {
    const wrapper = mountJsonForms('foo', schema, uischema);
    const radioLabels = wrapper.findAll('label[for*="-input-"]');
    expect(radioLabels.length).to.equal(3);
    expect(radioLabels[0].text()).to.equal('Foo');
    expect(radioLabels[1].text()).to.equal('Bar');
    expect(radioLabels[2].text()).to.equal('FooBar');
  });

  it('has correct radio button checked', () => {
    const wrapper = mountJsonForms('bar', schema, uischema);
    const radioInputs = wrapper.findAll('input[type="radio"]');
    expect((radioInputs[0].element as HTMLInputElement).checked).to.be.false;
    expect((radioInputs[1].element as HTMLInputElement).checked).to.be.true;
    expect((radioInputs[2].element as HTMLInputElement).checked).to.be.false;
  });

  it('emits a data change when radio button is selected', async () => {
    const wrapper = mountJsonForms('foo', schema, uischema);
    const radioInput = wrapper.findAll('input[type="radio"]')[2];
    await radioInput.setValue('foobar');
    expect(wrapper.vm.data).to.equal('foobar');
  });

  it('has proper name attribute for radio group', () => {
    const wrapper = mountJsonForms('foo', schema, uischema);
    const radioInputs = wrapper.findAll('input[type="radio"]');
    const firstName = radioInputs[0].attributes('name');
    radioInputs.forEach((input) => {
      expect(input.attributes('name')).to.equal(firstName);
    });
  });

  it('has proper id and for attributes for accessibility', () => {
    const wrapper = mountJsonForms('foo', schema, uischema);
    const radioInputs = wrapper.findAll('input[type="radio"]');
    const radioLabels = wrapper.findAll('label[for*="-input-"]');

    radioInputs.forEach((input, index) => {
      const inputId = input.attributes('id');
      const labelFor = radioLabels[index].attributes('for');
      expect(inputId).to.equal(labelFor);
    });
  });
});
