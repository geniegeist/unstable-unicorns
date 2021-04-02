import React from 'react';
import './EndTurnButton.css';

class EndTurnButton extends React.Component {

    componentDidMount() {
        const docStyle = document.documentElement.style;
        const aElem = document.querySelector('.parallaxbutton');
        const boundingClientRect = aElem.getBoundingClientRect();

        aElem.onmousemove = function (e) {

            const x = e.clientX - boundingClientRect.left;
            const y = e.clientY - boundingClientRect.top;

            const xc = boundingClientRect.width / 2;
            const yc = boundingClientRect.height / 2;

            const dx = x - xc;
            const dy = y - yc;

            docStyle.setProperty('--rx', `${dy / -1}deg`);
            docStyle.setProperty('--ry', `${dx / 10}deg`);

        };

        aElem.onmouseleave = function (e) {

            docStyle.setProperty('--ty', '0');
            docStyle.setProperty('--rx', '0');
            docStyle.setProperty('--ry', '0');

        };

        aElem.onmousedown = function (e) {

            docStyle.setProperty('--tz', '-15px');

        };

        document.body.onmouseup = function (e) {

            docStyle.setProperty('--tz', '-12px');

        };

    }
    render() {
        return <div  className="parallaxbutton" data-title={this.props.children} onClick={() => this.props.onClick()}></div>
    }
}

export default EndTurnButton;