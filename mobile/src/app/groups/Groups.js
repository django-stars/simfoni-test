import React, { PureComponent } from 'react'
import { Text, View, StyleSheet, Image, Linking, FlatList } from 'react-native'
import { Button } from '../common/widgets'
import { AppHeader } from '../layouts'
import DataInfo from './DataInfo'
import EditableRow, { ListEmptyComponent, ListHeaderComponent } from './EditableRow'
import Images from '@images/images'

export default class Groups extends PureComponent {
  constructor (props) {
    super(props)
    this.renderItem = this.renderItem.bind(this)
  }

  renderItem ({ item, index }) {
    return (
      <EditableRow
        item={item}
        index={index}
        handleChange={this.props.handleChange}
        deleteGroup={this.props.deleteGroup}
      />
    )
  }

  render () {
    return (
      <View style={style.root}>
        <AppHeader headerStyle={style.header}>
          <View style={style.headerBtnWrapper} />
          <Image
            source={Images.logoDark}
            stype={style.logo}
          />
          <View style={style.headerBtnWrapper}>
            <Button buttonStyle={style.button} onPress={this.props.createGroup}>
              <Text style={style.buttonText}>+</Text>
            </Button>
          </View>
        </AppHeader>
        <View style={style.content}>
          <DataInfo upload={this.props.upload} />
          <FlatList
            renderItem={this.renderItem}
            data={this.props.groups.data}
            ListEmptyComponent={<ListEmptyComponent />}
            ListHeaderComponent={<ListHeaderComponent />}
            keyExtractor={keyExtractor}
            onRefresh={this.props.groups.fetch}
            refreshing={!!this.props.groups.loading}
            style={style.list}
          />
        </View>
      </View>
    )
  }
}

function keyExtractor ({uuid}, index) {
  return uuid || index
}

const style = StyleSheet.create({
  header: {
    justifyContent: 'space-between'
  },
  list: {
    backgroundColor: styles.WHITE,
    width: styles.DEVICE_WIDTH,
    flex: 1,
    alignSelf: 'stretch'
  },
  root: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: styles.WHITE,
    width: styles.DEVICE_WIDTH
  },
  content: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: styles.WHITE
  },
  logo: {

  },
  headerBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: 40
  },
  button: {
    backgroundColor: styles.COLOR_PRIMARY,
    paddingHorizontal: 0,
    width: 32,
    height: 32,
    borderRadius: 0
  },
  buttonText: {
    color: '#fff',
    fontSize: styles.FONT_SIZE_TITLE
  }
})
