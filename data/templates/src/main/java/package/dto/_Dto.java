package <%=packageName%>.dto;

import lombok.Data;

@Data
public class <%= entityClass %>Dto {
<% for (fieldId in fields) { %>
    private <%= fields[fieldId].fieldType %> <%= fields[fieldId].fieldName %>;
<% } %>
}
