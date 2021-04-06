import React from 'react';
import {connect} from "react-redux";
import {setLang} from "../redux/actions";

// Language files
import en from '../languages/en';
import fr from '../languages/fr';

class LanguageButton extends React.Component {

    changeLanguage() {

        if (this.props.lang === 'en') {
            this.props.setLang(fr, 'fr');
        } else {
            this.props.setLang(en, 'en');
        }
    }

    render() {
        const {language, lang, editOn, buttonClass} = this.props;

        if (language) {
            return(
                <button className={buttonClass}
                        disabled={editOn}
                        data-place={'bottom'}
                        data-tip={language.languageButtonText}
                        onClick={this.changeLanguage.bind(this)}>
                    <i className={'icon icon-language mr-2'}/>
                    <span className='mr-1'>{language[lang]}</span>
                </button>
            )
        } else {
            return (
                <></>
            )
        }

    }
}
function mapStateToProps(state) {
    return {
        language: state.language,
        lang: state.lang,
        editOn: state.editOn
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setLang: (langFile, lang) => dispatch(setLang(langFile, lang))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageButton);