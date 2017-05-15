import os

from httplib import HTTPConnection

BOUNDARY = "$PythonULoadTEST$"
CRLF = '\r\n'

def upload( addr, url, formfields, filefields ):
	formsections = []
	for name in formfields:
		print(formfields[name])
		section = [
			'--'+BOUNDARY,
			'Content-disposition: form-data; name="%s"' % name,
			'',
			formfields[name]
			]
		print(section)
	formsections.append(CRLF.join(section)+CRLF)

	fileinfo = [(os.path.getsize(filename), formname, filename)
			for formname, filename in filefields.items()]
	filebytes = 0
	fileheaders = []
	for filesize, formname, filename in fileinfo:
		headers = [
			'--'+BOUNDARY,
			'Content-Disposition: form-data; name="%s"; filename="%s" ' % (formname, filename),
			'Content-Length: %d' % filesize,
			'',
			]
		fileheaders.append(CRLF.join(headers)+CRLF)
		filebytes += filesize
	closing = "--"+BOUNDARY+"--\r\n"

	content_size = (sum(len(f) for f in formsections) +
			sum(len(f) for f in fileheaders) +
			filebytes+len(closing))

	conn = HTTPConnection(*addr)
	conn.putrequest("POST",url)
	conn.putheader("Content-Type",'multipart/mixed; boundary=%s' % BOUNDARY)
	conn.putheader("Content-Length", str(content_size))
	conn.endheaders()

	for s in formsections:
		conn.send(s.encode('latin-1'))

	for head,filename in zip(fileheaders,filefields.values()):
		conn.send(head.encode('latin-1'))
		f = open(filename,"rb")
		while True:
			chunk = f.read(16384)
			if not chunk: break
			conn.send(chunk)
		f.close()

	conn.send(closing.encode('latin-1'))
	r = conn.getresponse()
	responsedata = r.read()
	conn.close()
	return responsedata

server = ('scorm.academy-smart.org.ua', 80)
url = ('/player/uploadCourse')
formfields = {
	'company_id': 1,
}
filefields = {
	'file': 'NewQuizScorm.zip',
}
resp = upload(server, url, formfields, filefields)
print(resp)
	
