import React, { PureComponent } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import PureChart from 'react-native-pure-chart'
import Images from '@images/images'
import { AppHeader } from '../layouts'
import isEmpty from 'lodash/isEmpty'

export default class Chart extends PureComponent {
  render () {
    return (
      <View style={style.root}>
        <AppHeader>
          <Image
            source={Images.logoDark}
            stype={style.logo}
          />
        </AppHeader>
        <View style={style.wrapper}>
          {
            !isEmpty(this.props.chart.data) && (
              <PureChart
                type={'bar'}
                data={prepareData(this.props.chart.data)}
                height={styles.DEVICE_HEIGHT / 2}
                numberOfYAxisGuideLine={10}
                width={'100%'}
              />
            )
          }
        </View>
      </View>
    )
  }
}

function prepareData (data = []) {
  return [
    {
      seriesName: 'series1',
      color: '#2196f3',
      data: data.map(({name: x, value: y}) => ({x, y}))
    }
  ]
}

const style = StyleSheet.create({
  root: {
    flex: 1,
    width: styles.DEVICE_WIDTH,
    alignSelf: 'stretch',
    flexDirection: 'column',
    backgroundColor: styles.COLOR_WHITE
  },
  wrapper: {
    flex: 1,
    flex: 1,
    width: styles.DEVICE_WIDTH,
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {

  }
})
