import BaseFieldHOC from './BaseFieldHOC'

import FileInput from './inputs/FileInput'
// import CheckboxInput from './inputs/CheckboxInput'
// import CurrencyInput from './inputs/CurrencyInput'
// import DateInput from './inputs/DateInput'
// import NumberInput from './inputs/NumberInput'
// import RadiosInput from './inputs/RadiosInput'
// import SelectInput from './inputs/SelectInput'
// import SelectRangeInput from './inputs/SelectRangeInput'
// import TextInput from './inputs/TextInput'
// import TextAreaInput from './inputs/TextAreaInput'

const FileInputField = BaseFieldHOC(FileInput)
// const CurrencyField = BaseFieldHOC(CurrencyInput)
// const DateField = BaseFieldHOC(DateInput)
// const NumberField = BaseFieldHOC(NumberInput)
// const RadiosField = BaseFieldHOC(RadiosInput)
// const SelectField = BaseFieldHOC(SelectInput)
// const SelectRangeField = BaseFieldHOC(SelectRangeInput)
// const TextField = BaseFieldHOC(TextInput)
// const TextAreaField = BaseFieldHOC(TextAreaInput)

export {
  FileInputField
  // CheckboxField,
  // CurrencyField,
  // DateField,
  // NumberField,
  // RadiosField,
  // SelectField,
  // SelectRangeField,
  // TextField,
  // TextAreaField,
}
