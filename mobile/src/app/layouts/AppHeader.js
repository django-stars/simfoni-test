import React from 'react'
import { PropTypes } from 'prop-types'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'

export default function Header ({ children, headerStyle = {} }) {
  return (
    <View style={[style.main, headerStyle]}>
      {children}
    </View>
  )
}

Header.propTypes = {

}

Header.defaultProps = {

}

const style = StyleSheet.create({
  main: {
    height: styles.HEADER_HEIGHT,
    width: styles.DEVICE_WIDTH,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: styles.FONT_SIZE,
    backgroundColor: styles.COLOR_WHITE,
    paddingTop: styles.STATUSBAR_HEIGHT,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 1}
  }
})
