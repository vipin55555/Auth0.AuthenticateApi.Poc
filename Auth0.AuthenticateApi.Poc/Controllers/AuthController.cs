using Auth0.AuthenticationApi.Api.IServices;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Auth0.AuthenticationApi.Api.Controllers {

    [Consumes("application/json", new string[] { "multipart/form-data" })]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class AuthController : Controller {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService) {
            this._authService = authService;
        }

        /// <summary>
        /// Get Auth0 Authorization Url
        /// </summary>
        /// <returns></returns>
        [HttpGet("AuthorizationUrl")]
        public async Task<IActionResult> GenerateAuth0AuthorizationUrl() {
            try {
                return Redirect(this._authService.GenerateAuth0AuthorizationUrl());

            } catch (Exception) {
                throw;
            }
        }

        /// <summary>
        /// Get Auth0 access token 
        /// </summary>
        /// <param name="authorize_code">This will be recieved via Auth0 Authorization Url</param>
        /// <returns></returns>
        [HttpGet("AccessToken")]
        public async Task<IActionResult> GetAuth0AccessToken([FromQuery] string authorize_code) {

            try {
                return Ok(await this._authService.GetAuth0AccessToken(authorize_code));

            } catch (Exception) {

                throw;
            }
        }

    }
}
