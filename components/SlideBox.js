import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

import { SliderBox } from "react-native-image-slider-box";

export default class SlideBox extends Component {
  constructor(props) {
    super(props);

    console.log(props);

    if (props.array && props.array.length > 0){
      this.state = {
        images: props.array
      };
    }
    else{
      this.state = {
        images: [require("../assets/img/nophoto.png")]
      };
    }


  }

  render() {
    return (
        <SliderBox
          images={this.state.images}
          ImageComponentStyle={{borderTopLeftRadius: 25, borderTopRightRadius: 25}}
          onCurrentImagePressed={index =>
            console.warn(`image ${index} pressed`)
          }
        />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1

  }
});
