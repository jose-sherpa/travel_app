import React from "react";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";

const style = {
    textDecoration: 'none',
};

export default function LinkButton({to, children, ...rest}) {
    return (
        <Link to={to} {...rest} style={style}>
            <Button>{children}</Button>
        </Link>
    )
}
