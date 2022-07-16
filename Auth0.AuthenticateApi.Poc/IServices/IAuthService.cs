using Auth0.AuthenticationApi.Models;
using System.Threading.Tasks;

namespace Auth0.AuthenticationApi.Api.IServices {
    public interface IAuthService {
        string GenerateAuth0AuthorizationUrl();
        Task<AccessTokenResponse> GetAuth0AccessToken(string authorize_code);
        bool ValidateToken();
    }
}
