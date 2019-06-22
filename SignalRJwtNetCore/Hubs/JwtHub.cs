using Microsoft.AspNetCore.Connections.Features;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRJwtNetCore.Hubs
{
    public class JwtHub: Hub
    {
        public async override Task OnConnectedAsync()
        {
            var user = Context.User;
            if(!user.Identity.IsAuthenticated)
                throw new System.Exception("Unauthorized!");
            var tokenExpEpochStr = user.Claims.SingleOrDefault(cl => cl.Type == "exp");
            if (tokenExpEpochStr == null)
                return;
            var tokenExpTimeEpoch = Int64.Parse(tokenExpEpochStr.Value);
            var feature = Context.Features.Get<IConnectionHeartbeatFeature>();
            if (feature == null)
                return;

            feature.OnHeartbeat(state =>
            {
                var (context, tokenExpTime, userClient) = ((HubCallerContext, long, IClientProxy)) state;
                if (!context.ConnectionAborted.IsCancellationRequested)
                {
                    if (new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds() > tokenExpTime)
                    {
                        userClient.SendAsync("TokenExpired");
                        context.Abort();
                    }
                }

            }, (Context, tokenExpTimeEpoch, this.Clients.Caller));


            base.OnConnectedAsync();
        }
    }
}
