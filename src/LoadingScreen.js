import React from "react";
import logotext from "./logotext.png";

class LoadingScreen extends React.Component {
    render() {
        return (
            <div
                style={{
                    height: "100vh",
                    width: "100vw",
                    display: "flex",
                    margin: "auto",
                    textAlign: "center",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <img
                    style={{
                        maxWidth: "70%",
                        maxHeight: "70%",
                        display: "flex",
                        margin: "auto",
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    src={logotext}
                    alt="logo"
                />
            </div>
        );
    }
}

export default LoadingScreen;
