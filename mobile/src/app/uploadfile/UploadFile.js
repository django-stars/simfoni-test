import { Text, View, StyleSheet, Image } from 'react-native'
import { View as AnimatedView } from 'react-native-animatable'
import { TabBarIcon, Button } from '../common/widgets'
import { AppHeader } from '../layouts'
import Images from '@images/images'
import isEmpty from 'lodash/isEmpty'

export default class UploadFile extends PureComponent {
  constructor (props) {
    super(props)
    this.renderInfo = this.renderInfo.bind(this)
  }

  renderInfo () {
    const { errors } = this.props.upload
    const { fileName } = this.props
    if (isEmpty(errors) && !fileName) return null
    return (
      <AnimatedView
        style={[style.info, !isEmpty(errors) ? style.infoError : style.infoSucces ]}
        animation='fadeIn'
      >
        {isEmpty(errors) && <Text style={style.infoTitle}>Current selected file</Text>}
        <Text style={[style.infoData, !isEmpty(errors) ? style.infoDataError : style.infoDataSucces ]}>{!isEmpty(errors) ? errors[0] : fileName}</Text>}
      </AnimatedView>
    )
  }

  render () {
    return (
      <View style={style.root}>
        <AppHeader>
          <Image
            source={Images.logoDark}
            stype={style.logo}
          />
        </AppHeader>
        <View style={style.content}>
          <Button buttonStyle={style.buttonStyle} onPress={this.props.selectFile}>
            <Image
              source={Images.file}
              stype={style.logo}
            />
            <Text style={style.buttonText}>Tap to select a file</Text>
          </Button>
          {this.renderInfo()}
        </View>
      </View>
    )
  }
}

const style = StyleSheet.create({
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
    justifyContent: 'center',
    marginHorizontal: 45,
    backgroundColor: styles.WHITE
  },
  logo: {

  },
  text: {
    fontSize: styles.FONT_SIZE_TITLE,
    color: styles.COLOR_GREY
  },
  buttonText: {
    fontSize: styles.FONT_SIZE_TITLE,
    color: styles.COLOR_GREY,
    marginVertical: styles.FONT_SIZE,
    fontStyle: 'italic'
  },
  buttonStyle: {
    backgroundColor: styles.COLOR_WHITE
  },
  info: {
    borderWidth: 1,
    borderStyle: 'solid',
    paddingVertical: styles.FONT_SIZE,
    alignSelf: 'stretch',
    alignItems: 'center'
  },
  infoError: {
    backgroundColor: 'rgba(239, 11, 60, 0.42)',
    borderColor: styles.COLOR_ERROR
  },
  infoSucces: {
    backgroundColor: styles.COLOR_SUCCESS,
    borderColor: 'rgba(152, 187, 217, 0.1)'
  },
  infoTitle: {
    fontSize: styles.FONT_SIZE,
    color: styles.COLOR_GREY
  },
  infoData: {
    fontSize: styles.FONT_SIZE
  },
  infoDataSucces: {
    color: styles.COLOR_FONT
  },
  infoDataError: {
    color: styles.COLOR_ERROR
  }
})
