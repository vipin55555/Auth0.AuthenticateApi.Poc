import { createContext, useContext, useState, useEffect, useReducer, ComponentType } from "react"
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { core } from '../constants';


const AuthContext = createContext<any>({
    isAuthenticated: false,
    isLoading: false,
    error: undefined,
    isTokenValidated: false,
    getAccessToken: () => { },
    login: () => { },
    logout: () => { }
});

const AuthProvider = (props: any) => {
    const apiBasePath = process.env.REACT_APP_API_BASE_PATH;
    const [state, dispatch] = useReducer(auth0Reducer, {
        isAuthenticated: false,
        isLoading: false,
        error: undefined,
        isTokenValidated: false
    });
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        // Auth0Redirect url contains code(authorize_code).So if both code and access token in session is not available 
        // then get Auth0 Redirect Url from backend server
        if (!(searchParams.get("code") || "") && !getAccessToken()) {
            generateAuth0AuthorizationUrl();
        }
        // If code and state is available but token is no available in session then get access token 
        // by sending code(received from Auth0 Redirect Url) to backend server
        else if ((searchParams.get("code") || "") && (searchParams.get("state") || "") && !getAccessToken()) {
            searchParams.set("state", "");
            setSearchParams(searchParams);
            getTokenFromApi(searchParams.get("code") || "");
        }
        // If token is already available in session then proceed further 
        else if (getAccessToken()) {
            dispatch({ type: core.constants.auth0.IS_TOKEN_VALIDATED });
        }
    }, [location]);

    /**
     * If token is available, we can validate it with our backend server
     */
    useEffect(() => {
        if (state.isAuthenticated && !state.isTokenValidated) {
            validateToken();
        }
    }, [state?.isAuthenticated]);


    /**
     * Get Auth0 redirect url from backend server
     */
    const generateAuth0AuthorizationUrl = () => {
        dispatch({ type: core.constants.auth0.GET_ACCESS_TOKEN_STARTED })
        window.location.href = `${apiBasePath}auth/authorizationUrl`;
    }

    /**
     * Get token from backend server by sending code to backend server
     */
    const getTokenFromApi = async (authorize_code: string) => {
        try {
            dispatch({ type: core.constants.auth0.GET_ACCESS_TOKEN_STARTED })
            const resp = await hitApi({
                url: `${apiBasePath}auth/accessToken?authorize_code=${authorize_code}`,
                method: 'get',
            });
            searchParams.set("code", "");
            setSearchParams(searchParams);
            dispatch({ type: core.constants.auth0.GET_ACCESS_TOKEN_COMPLETE, payload: resp });
        } catch (error: any) {
            dispatch({ type: core.constants.auth0.GET_ACCESS_TOKEN_FAILED, payload: error?.response?.data });
        }
    }

    /**
     *  If token is available, we can validate it with our backend server
    */
    const validateToken = async () => {        
        try {
            const resp = await hitApi({
                url: `${apiBasePath}auth/validateToken`,
                method: 'get',
                accessToken: getAccessToken() || ""
            });
            dispatch({ type: core.constants.auth0.VALIDATE_TOKEN_COMPLETE, payload: resp });
        } catch (error: any) {
            dispatch({ type: core.constants.auth0.ERROR, payload: error?.response?.data });
        }
    }


    /**
     * Clear session and generate new auth0 redirect url
     */
    const logout = () => {
        localStorage.clear();
        generateAuth0AuthorizationUrl();
        dispatch({ type: core.constants.auth0.LOGOUT });
    }


    /**
     * Get access token from session
     */
    const getAccessToken = () => {
        return localStorage.getItem("accessToken") || "";
    }

    /**
     * Communicate to backend server by using this method to hit API
     * @param request 
     * @returns 
     */
    const hitApi = async (request: any) => {
        try {
            const resp = await axios({
                url: request.url,
                method: request.method,
                data: request.data || null,
                headers: { Authorization: request?.accessToken ? ("Bearer " + request?.accessToken) : "" },
                params: request.params
            });
            return resp.data;
        } catch (error) {
            throw error;
        }
    }

    const contextValue: any = {
        ...state,
        getAccessToken,
        login: generateAuth0AuthorizationUrl,
        logout
    };

    return (<AuthContext.Provider value={contextValue}>{props?.children}</AuthContext.Provider>)
};

export const auth0Reducer = (state: any, action: any) => {
    switch (action.type) {
        case core.constants.auth0.GET_ACCESS_TOKEN_STARTED:
            return {
                ...state,
                isAuthenticated: false,
                isLoading: true,
            };
        case core.constants.auth0.GET_ACCESS_TOKEN_COMPLETE:
            localStorage.setItem("accessToken", action?.payload?.accessToken || "");
            localStorage.setItem("idToken", action?.payload?.idToken || "");
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
            };
        case core.constants.auth0.GET_ACCESS_TOKEN_FAILED:
            return {
                ...state,
                isAuthenticated: false,
                isLoading: false,
                isTokenValidated: false,
                error: action?.payload,
            };
        case core.constants.auth0.IS_TOKEN_VALIDATED:
            return {
                ...state,
                isAuthenticated: true,
                isTokenValidated: true
            };
        case core.constants.auth0.VALIDATE_TOKEN_COMPLETE:
            return {
                ...state,
                isTokenValidated: true
            };
        case core.constants.auth0.LOGOUT:
            return {
                ...state,
                isAuthenticated: false,
                isLoading: false,
                isTokenValidated: false,
            };
        case core.constants.auth0.ERROR:
            return {
                ...state,
                isLoading: false,
                error: action?.payload
            };
        default:
            throw new Error();
    }
}

export { AuthProvider }
export const useAuth = () => useContext(AuthContext);