/*
* Alert module
* Use for notify user, show error messages
*
*/

import Swal from 'sweetalert2';

import store from './redux/store'
import {setToken, setAuthUser} from './redux/actions'

class AlertModule {

    showMessage(type, title, message, loginFailedError) {

        Swal.fire({
            title: title,
            html: message,
            icon: type,
            allowOutsideClick: false,
            showCancelButton: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.value) {
                if (loginFailedError) {

                    store.dispatch(setAuthUser(null));
                    store.dispatch(setToken(null));
                    document.location = process.env.NODE_ENV !== 'development' ? `${process.env.PUBLIC_URL}` : '/';
                } else {
                    Swal.close();
                }
            }
        })

        document.body.classList.remove('swal2-height-auto');
    }

    getConfirmation(type, title, message) {

        document.body.classList.remove('swal2-height-auto');

        return new Promise((res, rej) => {

            Swal.fire({
                title: title,
                html: message,

                allowOutsideClick: false,
                showCancelButton: true,
                allowEscapeKey: false,
                allowEnterKey: false,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#a7a8a7',
                confirmButtonText: 'Sayfadan Ayrıl',
                cancelButtonText: 'İptal'

            }).then((result) => {

                res(result.value)
            })
        })



    }
}

export default AlertModule;