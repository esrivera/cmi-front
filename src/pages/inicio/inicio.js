import React, { Component } from "react";

export default class Home extends Component {
  componentDidMount() {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    console.log(config);
  }

  render() {
    return <h2>Yo are loged in</h2>;
  }
}
