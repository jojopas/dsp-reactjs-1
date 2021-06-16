import React from 'react';
import axios from "axios";
import {useForm} from "react-hook-form";
import { constants } from '../../../config';

import '../../Form/Form.less';
import '../ContactForm.less';
import Recaptcha from '../../recaptcha/Recaptcha';

export default function Form({user}) {
    //TODO Unused currently. Once auth0 and profile work is in, attempt to preload user metadata into fields below
    const [showSendError, setShowSendError] = React.useState(false);
    const [formSubmitted, setFormSubmitted] = React.useState(false);
    const [enableSubmitButton, setEnableSubmitButton] = React.useState(false);

    const parseFullName = () => {
        if (user.profile && user.profile.user_metadata) {
            const firstname = user.profile.user_metadata.firstname || user.profile && user.profile.given_name || '';
            const lastname = (user.profile.user_metadata.lastname) || (user.profile && user.profile.family_name) || '';
            return (firstname ? `${firstname} ` : "") + lastname;
        }
        return "";
    }

    const onSubmit = async (formData) => {
        await axios({
                method: 'POST',
                url: '/api/ln/send-feedback',
                data: formData
            })
            .then((response) => {
                if (response !== undefined 
                    && response.data && response.data.data
                    && response.data.data[0] === true) 
                {
                    setShowSendError(false);
                    setFormSubmitted(true);
                } else {
                    setShowSendError(true);
                }
            })
            .catch(() => {
                setShowSendError(true);
            });
    }

    const { handleSubmit, register, errors } = useForm({
        // https://react-hook-form.com/api
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            senderName: "", //parseFullName(),
            senderEmailAddress: "", //user.profile ? user.profile.email : '',
            zipcode: "",
            device: "",
            provider: "",
            message: ""
        }
    });

    React.useEffect(() => {
        if (Object.keys(errors).length !== 0 && errors.constructor === Object) {
            // console.log('Validation errors: ', errors);
        }
    }, [errors]);

    const recaptchaVerifiedCallback = () => {
        setEnableSubmitButton(true);
    }

    const recaptchaExpiredCallback = () => {
        setEnableSubmitButton(false);
    }

    return (
        <div className="form-container-inner">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {formSubmitted ? (
                        <ul>
                            <li>
                                <p>Success! Thank you for contacting us. We look forward to reviewing your message.</p>
                            </li>
                        </ul>
                    ) : ""}

                    {/* Hide the form if the form has been submitted */}
                    <div className={formSubmitted ? "hide-form" : "" }>
                        <ul>
                            <li>
                                <label htmlFor="senderName">Name</label>
                                <input name="senderName" ref={register()} />
                            </li>
                            <li className={errors.senderEmailAddress && 'invalid'}>
                                <label htmlFor="senderEmailAddress">Email Address&nbsp;<span className="required-mark">*</span></label>
                                <input name="senderEmailAddress" ref={register({
                                    required: 'Required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "invalid email address"
                                    }
                                })} placeholder="example@domain.com" />
                                <span>{errors.senderEmailAddress && errors.senderEmailAddress.message}</span>
                            </li>
                            <li className={errors.zipcode && 'invalid'}>
                                <label htmlFor="zipcode">Zip Code</label>
                                <input name="zipcode" ref={register({
                                    pattern: {
                                        value: /^[0-9]{5}(-[0-9]{4})?$/i,
                                        message: "Invalid postal code"
                                    }
                                })} />
                                <span>{errors.zipcode && errors.zipcode.message}</span>
                            </li>
                            <li className={errors.device && 'invalid'}>
                                <label htmlFor="device">Device&nbsp;<span className="required-mark">*</span></label>
                                <select name="device" ref={register({
                                    required: 'Required',
                                    validate:
                                    {
                                        selected: (value) => {
                                            if (value)
                                                return true;
                                            return 'Please make a selection';
                                        }
                                    }
                                })}>
                                    <option value="">Please Select a Device...</option>
                                    <option value="Amazon FireTV" >Amazon FireTV </option>
                                    <option value="Android Phone" >Android Phone </option>
                                    <option value="Android Tablet">Android Tablet</option>
                                    <option value="Android TV">Android TV</option>
                                    <option value="Apple TV">Apple TV</option>
                                    <option value="Hisense TV">Hisense TV</option>
                                    <option value="iPod">iPod</option>
                                    <option value="iPhone">iPhone</option>
                                    <option value="iPad">iPad</option>
                                    <option value="PC/Web">PC/Web</option>
                                    <option value="Roku">Roku</option>
                                    <option value="Tizen TV">Tizen TV</option>
                                    <option value="Vizio TV">Vizio TV</option>
                                    <option value="Xfinity Flex">Xfinity Flex</option>
                                    <option value="Xfinity X1">Xfinity X1</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.device && (errors.device.type === 'selected' || errors.device.type === 'required') && (<span>Please make a selection</span>)}
                            </li>
                            <li>
                                <label htmlFor="provider">Provider</label>
                                <select name="provider"  ref={register()}>
                                    <option value="">Please Select an Option....</option>
                                    <option value="Dish Hopper">Dish Hopper</option>
                                    <option value="Local Now App">Local Now App</option>
                                    <option value="Local Now Website">Local Now Website</option>
                                    <option value="Sling TV">Sling TV</option>
                                    <option value="Xumo">Xumo</option>
                                </select>
                            </li>
                        </ul>
                        {/* We put this textarea on a new line in order to give the user as much space as possible to type out their message */}
                        <ul>
                            <li className={errors.message && 'invalid'}>
                                <label htmlFor="message">Comments&nbsp;<span className="required-mark">*</span></label>
                                <textarea name="message" ref={register({ required: 'Required' })} placeholder="Please enter your feedback here..."></textarea>
                                <span className="textArea">{errors.message && errors.message.message}</span>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <Recaptcha verifyCallback={recaptchaVerifiedCallback} expiredCallback={recaptchaExpiredCallback}></Recaptcha>
                            </li>
                            <li>
                                <button type="submit" disabled={!enableSubmitButton}>{constants.CONTACTUS_FORM_SUBMIT}</button>
                                <span>{showSendError ? "Oops! Your message didn’t send. Please try again in a few minutes" : ""}</span>
                            </li>
                        </ul>
                    </div>
                </form>
            </div>
    )
}
