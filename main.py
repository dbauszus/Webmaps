import os
import jinja2
import webapp2

jinja_environment = jinja2.Environment(autoescape=True,
    loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')))

class OL2_CARTODB(webapp2.RequestHandler):
    def get(self):
        template = jinja_environment.get_template('ol2-cartodb.html')
        self.response.out.write(template.render())
        
class OL2_WFS(webapp2.RequestHandler):
    def get(self):
        template = jinja_environment.get_template('ol2-wfs.html')
        self.response.out.write(template.render())
        
class OL2_XYZ(webapp2.RequestHandler):
    def get(self):
        template = jinja_environment.get_template('ol2-xyz.html')
        self.response.out.write(template.render())

class OL3(webapp2.RequestHandler):
    def get(self):
        template = jinja_environment.get_template('ol3.html')
        self.response.out.write(template.render())
        
class OL3_CARTODB(webapp2.RequestHandler):
    def get(self):
        template = jinja_environment.get_template('ol3-cartodb.html')
        self.response.out.write(template.render())

class OL3_WFS(webapp2.RequestHandler):
    def get(self):
        template = jinja_environment.get_template('ol3-wfs.html')
        self.response.out.write(template.render())
        
class OL3_WFS_T(webapp2.RequestHandler):
    def get(self):
        template = jinja_environment.get_template('ol3-wfs-t.html')
        self.response.out.write(template.render())
        
class OL3_GMAPS(webapp2.RequestHandler):
    def get(self):
        template = jinja_environment.get_template('ol3-gmaps.html')
        self.response.out.write(template.render())
        
class CARTODB(webapp2.RequestHandler):
    def get(self):
        template = jinja_environment.get_template('cartodb.html')
        self.response.out.write(template.render())
        
class GMAPS(webapp2.RequestHandler):
    def get(self):
        template = jinja_environment.get_template('gmaps.html')
        self.response.out.write(template.render())           

class FindNearestPostcode(webapp2.RequestHandler):
    def get(self):
        template = jinja_environment.get_template('find-nearest-postcode.html')
        self.response.out.write(template.render())     

app = webapp2.WSGIApplication([
    ('/ol2-cartodb', OL2_CARTODB),
    ('/ol2-wfs', OL2_WFS),
    ('/ol2-xyz', OL2_XYZ),

    ('/ol3', OL3),
    ('/ol3-cartodb', OL3_CARTODB),
    ('/ol3-wfs', OL3_WFS),
    ('/ol3-wfs-t', OL3_WFS_T),
    ('/ol3-wfs-t-material', OL3_WFS_T),
    ('/ol3-gmaps', OL3_GMAPS),

    ('/cartodb', CARTODB),
    ('/gmaps', GMAPS),

    ('/find-nearest-postcode', FindNearestPostcode),
], debug=True)