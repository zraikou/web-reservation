
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <table class="appointments-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Contact</th>
          <th>Email</th>
          <th>Service</th>
          <th>Date</th>
          <th>Time</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <xsl:for-each select="appointments/appointment">
          <tr>
            <td><xsl:value-of select="fullName"/></td>
            <td><xsl:value-of select="contactNumber"/></td>
            <td><xsl:value-of select="email"/></td>
            <td><xsl:value-of select="service"/></td>
            <td><xsl:value-of select="date"/></td>
            <td><xsl:value-of select="time"/></td>
            <td><xsl:value-of select="notes"/></td>
          </tr>
        </xsl:for-each>
      </tbody>
    </table>
  </xsl:template>
</xsl:stylesheet>
