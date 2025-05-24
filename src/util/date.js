'use strict';

const getNowAsLocalDatetime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset(); // en minutos
    const local = new Date(now.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
};

export { getNowAsLocalDatetime }