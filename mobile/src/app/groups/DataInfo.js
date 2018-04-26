import { StyleSheet, View, Text } from 'react-native'
import isEmpty from 'lodash/isEmpty'

export default function DataInfo ({ upload }) {
  if (isEmpty(upload)) return null
  const { imported, skipped, min, max } = upload
  if (!imported && imported !== 0) return null
  return (
    <View style={style.main}>
      <Text style={style.title}>DATA DETAILS</Text>
      <View style={style.row}>
        <View style={style.item}>
          <Text style={style.data}>{`${(imported - skipped).toLocaleString('en-IN')} of ${imported.toLocaleString('en-IN')}`}</Text>
          <Text style={style.desc}>Records</Text>
        </View>
        <View style={[style.item, style.border]}>
          <Text style={style.data}>{min.toLocaleString('en-IN')}</Text>
          <Text style={style.desc}>Min</Text>
        </View>
        <View style={[style.item, style.border]}>
          <Text style={style.data}>{max.toLocaleString('en-IN')}</Text>
          <Text style={style.desc}>Max</Text>
        </View>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  main: {
    width: styles.DEVICE_WIDTH
  },
  title: {
    fontSize: styles.FONT_SIZE,
    color: styles.COLOR_FONT,
    marginTop: styles.FONT_SIZE_TITLE,
    marginHorizontal: styles.FONT_SIZE,
    marginBottom: styles.FONT_SIZE,
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#f7fcff',
    padding: styles.FONT_SIZE_SMALL,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ebf7ff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ebf7ff',
    borderStyle: 'solid'
  },
  item: {
    alignItems: 'center',
    flex: 1
  },
  border: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#ebf7ff',
    borderStyle: 'solid'
  },
  data: {
    fontSize: styles.FONT_SIZE * 1.3,
    color: styles.COLOR_FONT
  },
  desc: {
    fontSize: styles.FONT_SIZE_SMALL,
    color: styles.COLOR_GREY
  }
})
