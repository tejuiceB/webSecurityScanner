from censys.search import CensysHosts
from config import settings

class CensysScanner:
    def __init__(self):
        self.client = CensysHosts(
            api_id=settings.CENSYS_API_ID,
            api_secret=settings.CENSYS_API_SECRET
        )

    async def get_host_info(self, ip_address: str):
        try:
            # Query Censys for host information
            host_data = self.client.view(ip_address)
            return {
                "services": host_data.get("services", []),
                "location": host_data.get("location", {}),
                "operating_system": host_data.get("operating_system", {}),
                "last_updated": host_data.get("last_updated", "")
            }
        except Exception as e:
            return {"error": str(e)}
