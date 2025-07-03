import sys
project_home = '/home/Sonec/epn_website'
if project_home not in sys.path:
    sys.path.append(project_home)
from app import create_app as application