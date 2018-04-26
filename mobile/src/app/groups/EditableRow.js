import { StyleSheet, TextInput, Text, View } from 'react-native'
import { Button } from '../common/widgets'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'

export default class EditableRow extends PureComponent {
  constructor (props) {
    super(props)
    this.state = isEmpty(props.item) ? { name: '' } : props.item
    this.onChange = this.onChange.bind(this)
    this.validate = this.validate.bind(this)
    this.deleteGroup = this.deleteGroup.bind(this)
  }

  onChange (name, value) {
    this.setState({[name]: name === 'name' ? value : parseFloat(value.replace(/[^0-9.,]/g, '') || '0').toLocaleString('en-IN')})
  }

  validate () {
    const { name, revenue_from, revenue_to } = this.state
    if (name && (revenue_from || revenue_to) && !isEqual(this.state, this.props.item)) {
      this.props.handleChange({...(this.props.item || {}), ...this.state}, this.props.index)
    }
  }

  deleteGroup () {
    const { index, item: { uuid }} = this.props
    this.props.deleteGroup({ index, uuid })
  }

  render () {
    const { name, revenue_from, revenue_to } = this.state
    const { index, deleteGroup } = this.props
    return (
      <View style={style.row}>
        <Text style={style.num}>{index + 1}</Text>
        <View style={style.cell}>
          <TextInput
            onChangeText={this.onChange.bind(this, 'name')}
            value={name}
            style={style.input}
          />
        </View>
        <View style={style.cell}>
          <TextInput
            onChangeText={this.onChange.bind(this, 'revenue_from')}
            value={revenue_from}
            style={style.input}
          />
        </View>
        <View style={style.cell}>
          <TextInput
            onChangeText={this.onChange.bind(this, 'revenue_to')}
            value={revenue_to}
            style={style.input}
          />
        </View>
        <Button buttonStyle={style.button} onPress={this.validate}>
          <Text style={style.buttonText}>&#10003;</Text>
        </Button>
        <Button buttonStyle={style.button} onPress={this.deleteGroup}>
          <Text style={style.buttonText}>-</Text>
        </Button>
      </View>
    )
  }
}

const style = StyleSheet.create({
  row: {
    width: styles.DEVICE_WIDTH - 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 4,
    backgroundColor: '#f0fff4',
    height: 64
  },
  cell: {
    flex: 1,
    marginRight: 10
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#bde1ff',
    // flex: 1,
    height: 36,
    // lineHeight: 36,
    fontSize: 14,
    color: styles.COLOR_FONT,
    justifyContent: 'center',
    paddingVertical: 0,
    paddingHorizontal: 8
  },
  button: {
    backgroundColor: '#bde1ff',
    paddingHorizontal: 0,
    width: 32,
    height: 32,
    borderRadius: 0,
    marginRight: 12
  },
  buttonText: {
    color: '#fff',
    fontSize: styles.FONT_SIZE_TITLE
  },
  nodata: {
    fontSize: styles.FONT_SIZE_TITLE,
    color: styles.COLOR_DESC,
    alignSelf: 'stretch',
    textAlign: 'center',
    marginVertical: styles.FONT_SIZE_TITLE,
    width: styles.DEVICE_WIDTH

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    width: styles.DEVICE_WIDTH,
    borderBottomColor: '#ebf7ff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingRight: 54
  },
  num: {
    fontSize: styles.FONT_SIZE,
    color: '#062d3f',
    textAlign: 'center',
    width: 26
  },
  headerTitle: {
    fontSize: styles.FONT_SIZE,
    color: '#062d3f',
    fontWeight: '600',
    textAlign: 'left',
    flex: 1
  }
})

export function ListEmptyComponent () {
  return <Text style={style.nodata}>Please add grouping</Text>
}

export function ListHeaderComponent () {
  return (
    <View style={style.header}>
      <Text style={style.num}>#</Text>
      <Text style={style.headerTitle}>Range</Text>
      <Text style={style.headerTitle}>From</Text>
      <Text style={style.headerTitle}>Up to</Text>
    </View>
  )
}
