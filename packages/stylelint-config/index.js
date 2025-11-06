import orderPlugin from 'stylelint-order';

// Stylelint flat config (ESM)
export default [
  {
    plugins: { order: orderPlugin },
    extends: ['stylelint-config-standard'],
    rules: {
      'no-important': true,
      'selector-class-pattern': [
        '^ty-[a-z0-9-]+$',
        { message: '类名需以 ty- 开头，仅含小写字母、数字、中划线' }
      ],
      'order/order': ['custom-properties', 'declarations'],
      'order/properties-alphabetical-order': true
    }
  }
];


