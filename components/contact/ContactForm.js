import React from 'react';
import { useObserver } from "mobx-react-lite";
import { StoreContext } from "../../store";
import Form from './helper/Form';

export default function ContactForm() {
    //TODO Unused currently. Once auth0 and profile work is in, attempt to preload user metadata into fields below
    const store = React.useContext(StoreContext);

    return useObserver(() => (
        <div className="contact-form">
            <Form user={null}></Form>
        </div>
    ));
}