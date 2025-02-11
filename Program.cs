var builder = WebApplication.CreateBuilder(args);

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVercel", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// ... other services

var app = builder.Build();

// Add this first, before any other middleware
app.UseCors("AllowVercel");

// Then your other middleware
app.UseHttpsRedirection();
app.UseAuthorization();
// etc... 