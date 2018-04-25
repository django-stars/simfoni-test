import BaseFieldHOC from './BaseFieldHOC'

import FileInput from './inputs/FileInput'
import CurrencyInput from './inputs/CurrencyInput'
import TextInput from './inputs/TextInput'

const FileInputField = BaseFieldHOC(FileInput)
const CurrencyField = BaseFieldHOC(CurrencyInput)
const TextField = BaseFieldHOC(TextInput)

export {
  CurrencyField,
  TextField,
  FileInputField,
  CurrencyInput,
  TextInput
}
