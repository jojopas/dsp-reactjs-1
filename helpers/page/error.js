import {isEmpty} from '../utils/objects';

export default function pageError(objs) {
    let error = false;
    objs.forEach((obj) => {
        if(isEmpty(obj)){
            error = true;
        }
    });

    return error;
}
