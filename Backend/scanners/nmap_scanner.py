import nmap
from typing import Dict, Any

class NmapScanner:
    def __init__(self):
        self.nm = nmap.PortScanner()

    async def scan_target(self, target: str) -> Dict[str, Any]:
        try:
            # Perform basic port scan
            self.nm.scan(target, arguments='-sV --version-intensity 5')
            
            results = {
                'hosts': {},
                'command': self.nm.command_line()
            }

            for host in self.nm.all_hosts():
                results['hosts'][host] = {
                    'state': self.nm[host].state(),
                    'ports': self.nm[host]['tcp'] if 'tcp' in self.nm[host] else {}
                }

            return results
        except Exception as e:
            return {"error": str(e)}
